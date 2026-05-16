from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class ProductOverview(BaseModel):
    product_name: str
    technical_description: str
    material_composition: str
    intended_use: str
    origin_country: str
    destination_country: str

class HSClassification(BaseModel):
    declared_hs_code: Optional[str]
    audited_hs_code: str
    hs_description: str
    confidence: float = Field(ge=0, le=1)
    confidence_label: str
    regulatory_basis: str
    classification_discrepancy: bool
    manager_override: bool
    override_reason: Optional[str]

class TariffAnalysis(BaseModel):
    applicable_rate: float
    rate_type: str
    fta_eligible: bool
    fta_name: Optional[str]
    preferential_rate: Optional[float]
    estimated_duty_usd: float

class RiskAssessment(BaseModel):
    risk_level: str
    identified_violations: List[str]
    penalty_exposure_usd: float
    shipment_hold_risk: str
    sanctions_flag: bool
    dual_use_flag: bool
    regulatory_flags: List[str]

class AgentReasoningStep(BaseModel):
    step: int
    agent: str
    action: str
    result: str
    source: Optional[str]

class Escalation(BaseModel):
    required: bool
    reason: Optional[str]
    assigned_to: Optional[str]
    priority: Optional[str]

class AuditReport(BaseModel):
    audit_id: str
    generated_at: str
    status: str
    product_overview: ProductOverview
    hs_classification: HSClassification
    tariff_analysis: TariffAnalysis
    risk_assessment: RiskAssessment
    agent_reasoning_chain: List[AgentReasoningStep]
    recommended_actions: List[str]
    escalation: Escalation

class AuditRequest(BaseModel):
    product_name: str
    technical_description: str
    material_composition: str
    intended_use: str
    origin_country: str
    destination_country: str
    declared_hs_code: Optional[str] = ""
    shipment_value: float

class AuditResponse(BaseModel):
    audit_id: str
    status: str
    created_at: datetime

class AuditStatusResponse(BaseModel):
    status: str
    progress: dict

class CustomsScrapeResult(BaseModel):
    destination_country: str
    hs_chapter: str
    tariff_rate: Optional[float]
    fta_eligible: bool
    sanctions_flag: bool
    regulatory_amendments: List[str]
    source_url: str
    retrieval_timestamp: str

class ClassificationResult(BaseModel):
    proposed_hs_code: str
    confidence: float
    gri_interpretation: str
    delta_usd: float
    dual_use_flagged: bool
