from crewai import Crew, Process, Task
from agents.customs_scraper import create_customs_scraper_agent
from agents.product_classifier import create_product_classifier_agent
from agents.legal_auditor import create_legal_auditor_agent
import logging

logger = logging.getLogger("tariffguard.crew")


def run_audit_crew(
    product_name: str,
    specifications: dict,
    destination_country: str,
    origin_country: str,
    hs_chapter: str,
    declared_hs_code: str,
    shipment_value: float,
    audit_id: str,
    step_callback=None,
):
    """
    Assemble and run the 3-agent TariffGuard CrewAI crew.
    Each agent factory initialises its own Gemini LLM internally.
    """
    print(f"\n[DEBUG] Menerima request audit. ID: {audit_id}, Product: {product_name}")
    logger.info(f"[{audit_id}] Creating agents...")
    scraper_agent = create_customs_scraper_agent()
    classifier_agent = create_product_classifier_agent()
    auditor_agent = create_legal_auditor_agent()

    task_scrape = Task(
        description=(
            f"Fetch all regulatory data for destination country '{destination_country}' "
            f"(origin: '{origin_country}'), HS chapter '{hs_chapter}'. "
            "Retrieve: MFN tariff rate, FTA eligibility, active sanctions check, "
            "and any recent regulatory amendments (< 180 days). "
            "Return a structured JSON object with source URLs and retrieval timestamps."
        ),
        expected_output="Valid JSON object matching CustomsScrapeResult schema.",
        agent=scraper_agent,
    )

    task_classify = Task(
        description=(
            f"Classify product '{product_name}' with the following specs: {specifications}. "
            f"Declared HS Code (if any): '{declared_hs_code}'. "
            f"Shipment value: USD {shipment_value}. "
            "Apply GRI sequence (1 → 6). Propose the most accurate 6–10-digit HS Code. "
            "If declared code differs, calculate the duty delta and flag misclassification severity. "
            "Return structured JSON."
        ),
        expected_output="Valid JSON object matching ClassificationResult schema.",
        agent=classifier_agent,
        context=[task_scrape],
    )

    task_audit = Task(
        description=(
            f"You are the Legal Compliance Auditor. Audit ID: {audit_id}. "
            "Validate outputs from the Customs Scraper and Product Classifier. "
            "Resolve any conflicts. Calculate overall risk level. "
            "Check for escalation conditions (sanctions, dual-use, penalty > $500k). "
            "Produce the FINAL AuditReport JSON — strict schema, no markdown, no prose."
        ),
        expected_output=(
            "A strictly formatted JSON object containing exactly these nested keys: "
            "{ 'audit_id': '...', 'generated_at': '...', 'status': '...', "
            "'product_overview': {'product_name': '...', 'technical_description': '...', 'material_composition': '...', 'intended_use': '...', 'origin_country': '...', 'destination_country': '...'}, "
            "'hs_classification': {'declared_hs_code': '...', 'audited_hs_code': '...', 'hs_description': '...', 'confidence': 1.0, 'confidence_label': '...', 'regulatory_basis': '...', 'classification_discrepancy': false, 'manager_override': false, 'override_reason': null}, "
            "'tariff_analysis': {'applicable_rate': 0.0, 'rate_type': '...', 'fta_eligible': false, 'fta_name': null, 'preferential_rate': null, 'estimated_duty_usd': 0.0}, "
            "'risk_assessment': {'risk_level': '...', 'identified_violations': [], 'penalty_exposure_usd': 0.0, 'shipment_hold_risk': '...', 'sanctions_flag': false, 'dual_use_flag': false, 'regulatory_flags': []}, "
            "'agent_reasoning_chain': [{'step': 1, 'agent': '...', 'action': '...', 'result': '...', 'source': '...'}], "
            "'recommended_actions': [], 'escalation': {'required': false, 'reason': null, 'assigned_to': null, 'priority': null} }"
        ),
        agent=auditor_agent,
        context=[task_scrape, task_classify],
    )

    crew_kwargs = dict(
        agents=[scraper_agent, classifier_agent, auditor_agent],
        tasks=[task_scrape, task_classify, task_audit],
        process=Process.hierarchical,
        manager_llm=create_legal_auditor_agent().llm,
        verbose=True,
        memory=False,  # disabled for now to avoid embedding model requirement
       
    )

    # Wire step_callback if provided (for progress tracking)
    if step_callback:
        crew_kwargs["step_callback"] = step_callback

    crew = Crew(**crew_kwargs)

    logger.info(f"[{audit_id}] Kicking off crew...")
    print(f"[DEBUG] Memulai CrewAI kickoff untuk {audit_id}...")
    result = crew.kickoff()
    logger.info(f"[{audit_id}] Crew finished.")
    print(f"[DEBUG] CrewAI selesai untuk {audit_id}. Hasil siap direturn.\n")
    return result
