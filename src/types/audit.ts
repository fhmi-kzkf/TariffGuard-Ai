export interface ProductOverview {
  product_name: string;
  technical_description: string;
  material_composition: string;
  intended_use: string;
  origin_country: string;
  destination_country: string;
}

export interface HSClassification {
  declared_hs_code?: string;
  audited_hs_code: string;
  hs_description: string;
  confidence: number;
  confidence_label: "High" | "Medium" | "Low";
  regulatory_basis: string;
  classification_discrepancy: boolean;
  manager_override: boolean;
  override_reason?: string;
}

export interface TariffAnalysis {
  applicable_rate: number;
  rate_type: string;
  fta_eligible: boolean;
  fta_name?: string;
  preferential_rate?: number;
  estimated_duty_usd: number;
}

export interface RiskAssessment {
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  identified_violations: string[];
  penalty_exposure_usd: number;
  shipment_hold_risk: "LOW" | "MEDIUM" | "HIGH";
  sanctions_flag: boolean;
  dual_use_flag: boolean;
  regulatory_flags: string[];
}

export interface AgentReasoningStep {
  step: number;
  agent: string;
  action: string;
  result: string;
  source?: string;
}

export interface Escalation {
  required: boolean;
  reason?: string;
  assigned_to?: string;
  priority?: "URGENT" | "STANDARD";
}

export interface AuditReport {
  audit_id: string;
  generated_at: string;
  status: "COMPLIANT" | "NON_COMPLIANT" | "REVIEW_REQUIRED";
  product_overview: ProductOverview;
  hs_classification: HSClassification;
  tariff_analysis: TariffAnalysis;
  risk_assessment: RiskAssessment;
  agent_reasoning_chain: AgentReasoningStep[];
  recommended_actions: string[];
  escalation: Escalation;
}

export interface AuditRecordSummary {
  id: string;
  status: string;
  product_name: string;
  destination_country: string;
  created_at: string;
}

export interface AuditsResponse {
  audits?: AuditReport[]; // actually data in our backend
  data?: AuditRecordSummary[];
  total: number;
  page: number;
  limit: number;
}
