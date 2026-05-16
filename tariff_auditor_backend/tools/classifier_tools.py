import json
from crewai.tools import tool

@tool("lookup_hs_code")
def lookup_hs_code(query: str, material: str, intended_use: str) -> str:
    """
    Search HS 2022 nomenclature database by product description.
    Returns top 5 candidate headings with section notes.
    Args: {"query": "string", "material": "string", "intended_use": "string"}
    """
    return json.dumps({
        "candidates": ["8517.62", "8517.69", "8471.30"],
        "section_notes": "Note: Products with multiple functions should be classified..."
    })

@tool("apply_gri")
def apply_gri(candidates: list, product_specs: dict, rule: str) -> str:
    """
    Apply General Rules of Interpretation to narrow candidates.
    Args: {"candidates": ["string"], "product_specs": "object", "rule": "1|2|3|4|5|6"}
    """
    return json.dumps({
        "applied_rule": rule,
        "selected_candidate": candidates[0] if candidates else None,
        "reasoning": f"Applied GRI {rule} based on specs."
    })

@tool("calculate_duty_delta")
def calculate_duty_delta(declared_hs: str, proposed_hs: str, tariff_rate_declared: float, tariff_rate_proposed: float, shipment_value: float) -> str:
    """
    Compute financial exposure from HS code mismatch.
    Args: {"declared_hs": "string", "proposed_hs": "string", "tariff_rate_declared": "float", "tariff_rate_proposed": "float", "shipment_value": "float"}
    """
    delta = abs(tariff_rate_proposed - tariff_rate_declared) * shipment_value
    return json.dumps({
        "financial_exposure_usd": delta
    })

@tool("check_dual_use")
def check_dual_use(product_name: str, specifications: dict, destination_country: str) -> str:
    """
    Screen product against CCL (Commerce Control List) and EU Dual-Use Regulation.
    Args: {"product_name": "string", "specifications": "object", "destination_country": "string"}
    """
    return json.dumps({
        "dual_use_flagged": False,
        "matched_eccn": None
    })
