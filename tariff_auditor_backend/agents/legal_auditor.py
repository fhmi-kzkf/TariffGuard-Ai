from crewai import Agent, LLM
from prompts.agent_prompts import LEGAL_AUDITOR_PROMPT
from tools.penalty_tools import request_case_study, override_classification, generate_audit_id, escalate_to_human
from config import settings
import os


def get_gemini_llm():
    """Initialize Gemini LLM for CrewAI — Manager agent via Google AI Studio."""
    os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
    return LLM(
        model="gemini/gemini-3.1-flash-lite-preview",
        temperature=0.1,
        api_key=settings.gemini_api_key,
        num_retries=3,
    )


def create_legal_auditor_agent() -> Agent:
    """Create the Legal Auditor (Manager) Agent powered by Gemini."""
    return Agent(
        role="Legal Compliance Auditor Agent",
        goal="Validate outputs, resolve conflicts, and produce final AuditReport JSON.",
        backstory=LEGAL_AUDITOR_PROMPT,
        llm=get_gemini_llm(),
        tools=[
            request_case_study,
            override_classification,
            generate_audit_id,
            escalate_to_human,
        ],
        verbose=True,
        allow_delegation=True,
        max_iter=5,
    )
