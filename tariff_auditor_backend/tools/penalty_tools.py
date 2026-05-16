import json
import uuid
from crewai.tools import tool

@tool("request_case_study")
def request_case_study(product_category: str, hs_chapter: str, destination_country: str) -> str:
    """
    Instruct Customs Scraper to fetch case studies.
    Use when Classifier confidence < 0.75.
    Args: {"product_category": "string", "hs_chapter": "string", "destination_country": "string"}
    """
    return json.dumps({
        "status": "requested",
        "rulings": ["Example case study found for " + product_category]
    })

@tool("override_classification")
def override_classification(original_hs: str, override_hs: str, override_reason: str, regulatory_basis: str) -> str:
    """
    Record a Manager-level HS Code override.
    Args: {"original_hs": "string", "override_hs": "string", "override_reason": "string", "regulatory_basis": "string"}
    """
    return json.dumps({
        "status": "overridden",
        "override_hs": override_hs
    })

@tool("generate_audit_id")
def generate_audit_id() -> str:
    """
    Generate a unique audit ID string (TGCA-YYYYMMDD-XXXX).
    Args: {}
    """
    import datetime
    date_str = datetime.datetime.now().strftime("%Y%m%d")
    unique_suffix = str(uuid.uuid4())[:4].upper()
    return f"TGCA-{date_str}-{unique_suffix}"

@tool("escalate_to_human")
def escalate_to_human(reason: str, priority: str, assigned_to: str) -> str:
    """
    Trigger human escalation flag with reason and priority.
    Args: {"reason": "string", "priority": "URGENT|STANDARD", "assigned_to": "Trade Compliance Officer"}
    """
    return json.dumps({
        "escalated": True,
        "reason": reason,
        "priority": priority,
        "assigned_to": assigned_to
    })
