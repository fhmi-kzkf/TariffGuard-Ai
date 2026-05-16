"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AlertTriangle, Download, Share, RefreshCcw, Info } from "lucide-react";
import type { AuditReport } from "@/types/audit";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AuditDetail() {
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/v1/audit/${id}`, fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Spinner className="w-8 h-8 text-accent-blue" />
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-center p-8">Failed to load audit {id}</div>;
  }

  // If status is processing
  if (data.status === "processing" || data.status === "failed") {
    return (
      <div className="max-w-7xl mx-auto px-8 py-[48px]">
        <Link href="/dashboard" className="text-accent-blue text-[14px] mb-8 inline-block hover:underline">← All Audits</Link>
        <Card level={1} className="p-8 text-center max-w-lg mx-auto">
          <h2 className="text-ink text-[24px] mb-4">Audit is {data.status}</h2>
          <p className="text-charcoal text-[14px] mb-6">Progress: {data.progress?.message}</p>
          {data.status === "processing" && <Spinner className="mx-auto" />}
        </Card>
      </div>
    );
  }

  // data is AuditReport
  const report = data as AuditReport;
  const isCompliant = report.status === "COMPLIANT";
  const glowClass = isCompliant ? "glow-green" : "glow-red";
  const badgeVariant = isCompliant ? "compliant" : report.status === "NON_COMPLIANT" ? "non-compliant" : "review";

  return (
    <div className={`w-full min-h-screen relative overflow-hidden pb-[96px]`}>
      <div className={`absolute inset-0 ${glowClass} -z-10 pointer-events-none opacity-20`} />
      
      <div className="max-w-5xl mx-auto px-8 pt-[48px]">
        <Link href="/dashboard" className="text-accent-blue text-[14px] mb-8 inline-block hover:underline">← All Audits</Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-[48px]">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-playfair text-[48px] text-ink leading-none">{report.product_overview.product_name}</h1>
              <Badge variant={badgeVariant} className="text-[14px] px-4 py-1">{report.status}</Badge>
            </div>
            <p className="font-geist-mono text-[13px] text-mute">Audit ID: {report.audit_id} • {new Date(report.generated_at).toLocaleString()}</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
            <Button variant="outline"><Share className="w-4 h-4 mr-2" /> Share</Button>
            <Button variant="primary"><RefreshCcw className="w-4 h-4 mr-2" /> Re-run</Button>
          </div>
        </div>

        {report.escalation?.required && (
          <Card level={2} className="p-6 border-accent-red bg-accent-red/10 mb-8 flex gap-4 items-start">
            <AlertTriangle className="w-6 h-6 text-accent-red shrink-0" />
            <div>
              <h3 className="font-inter font-bold text-accent-red mb-1">HUMAN REVIEW REQUIRED</h3>
              <p className="text-ink text-[14px] mb-2">{report.escalation.reason}</p>
              <div className="flex gap-4 text-[12px] text-charcoal">
                <span>Priority: <strong className="text-ink">{report.escalation.priority}</strong></span>
                <span>Assigned to: <strong className="text-ink">{report.escalation.assigned_to}</strong></span>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {/* SECTION 1: Product Overview */}
          <Card level={1} className="p-6">
            <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">1. Product Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-mute text-[12px] mb-1">Technical Description</p>
                <p className="text-ink text-[14px] leading-relaxed">{report.product_overview.technical_description}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-mute text-[12px] mb-1">Material Composition</p>
                  <p className="text-ink text-[14px]">{report.product_overview.material_composition}</p>
                </div>
                <div className="flex gap-12">
                  <div>
                    <p className="text-mute text-[12px] mb-1">Origin</p>
                    <p className="text-ink text-[16px]">{report.product_overview.origin_country}</p>
                  </div>
                  <div>
                    <p className="text-mute text-[12px] mb-1">Destination</p>
                    <p className="text-ink text-[16px]">{report.product_overview.destination_country}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 2: HS Code Decision */}
          <Card level={1} className="p-6">
            <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">2. HS Code Decision</h3>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-mute text-[12px] mb-1">Correct HS Code (Audited)</p>
                <p className="font-inter-tight text-[48px] text-ink leading-none tracking-tight mb-2">
                  {report.hs_classification.audited_hs_code}
                </p>
                <p className="text-charcoal text-[14px] mb-6">{report.hs_classification.hs_description}</p>
                
                <div className="bg-surface-deep border border-hairline-strong rounded-[8px] p-4 font-geist-mono text-[13px] text-charcoal">
                  <span className="text-accent-blue block mb-1">Regulatory Basis:</span>
                  {report.hs_classification.regulatory_basis}
                </div>
              </div>
              
              <div className="w-full md:w-64 shrink-0 space-y-4">
                <div className="p-4 bg-surface-card border border-hairline-strong rounded-[8px]">
                  <p className="text-mute text-[12px] mb-1">Declared HS Code</p>
                  <p className="text-ink font-mono">{report.hs_classification.declared_hs_code || "Not Provided"}</p>
                  {report.hs_classification.classification_discrepancy && (
                    <Badge variant="high" className="mt-2">DISCREPANCY DETECTED</Badge>
                  )}
                </div>
                
                <div className="p-4 bg-surface-card border border-hairline-strong rounded-[8px]">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-mute text-[12px]">Confidence</p>
                    <span className="text-ink text-[14px]">{report.hs_classification.confidence_label} ({(report.hs_classification.confidence * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-surface-deep rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${report.hs_classification.confidence > 0.8 ? 'bg-accent-green' : report.hs_classification.confidence > 0.5 ? 'bg-accent-yellow' : 'bg-accent-red'}`} 
                      style={{ width: `${report.hs_classification.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 3 & 4: Duty & Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card level={1} className="p-6">
              <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">3. Tariff & Duty Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal text-[14px]">Applicable Tariff Rate</span>
                  <span className="text-ink font-medium">{report.tariff_analysis.applicable_rate}% ({report.tariff_analysis.rate_type})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal text-[14px]">FTA Eligibility</span>
                  <Badge variant={report.tariff_analysis.fta_eligible ? "compliant" : "default"}>
                    {report.tariff_analysis.fta_eligible ? `YES - ${report.tariff_analysis.fta_name}` : "NO"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-hairline">
                  <span className="text-ink font-medium">Estimated Duty (USD)</span>
                  <span className="font-inter-tight text-[24px] text-ink">${report.tariff_analysis.estimated_duty_usd.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card level={1} className="p-6">
              <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">4. Risk Assessment</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-charcoal text-[14px]">Overall Risk Level</span>
                  <Badge variant={report.risk_assessment.risk_level === "LOW" ? "low" : report.risk_assessment.risk_level === "MEDIUM" ? "medium" : report.risk_assessment.risk_level === "HIGH" ? "high" : "critical"}>
                    {report.risk_assessment.risk_level}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal text-[14px]">Penalty Exposure</span>
                  <span className="text-ink font-medium text-[16px]">${report.risk_assessment.penalty_exposure_usd.toLocaleString()}</span>
                </div>
                
                {(report.risk_assessment.sanctions_flag || report.risk_assessment.dual_use_flag) && (
                  <div className="pt-4 space-y-2">
                    {report.risk_assessment.sanctions_flag && <Badge variant="critical">SANCTIONS FLAG</Badge>}
                    {report.risk_assessment.dual_use_flag && <Badge variant="critical">DUAL-USE ITEM</Badge>}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* SECTION 5: Reasoning Chain */}
          <Card level={1} className="p-6">
            <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">5. Agent Reasoning Chain</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-hairline-strong">
              {report.agent_reasoning_chain?.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas bg-surface-deep shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-[12px] font-bold text-ink">
                    {step.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-surface-card border border-hairline shadow">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={step.agent.includes("Manager") || step.agent.includes("Auditor") ? "manager" : "worker"}>
                        {step.agent}
                      </Badge>
                    </div>
                    <p className="text-ink text-[14px] font-medium mb-1">{step.action}</p>
                    <p className="text-charcoal text-[13px]">{step.result}</p>
                    {step.source && (
                      <p className="text-mute text-[11px] mt-2 font-geist-mono truncate">Source: {step.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* SECTION 6: Actions */}
          <Card level={1} className="p-6">
            <h3 className="font-inter font-medium text-[20px] text-ink mb-6 border-b border-hairline-strong pb-2">6. Recommended Actions</h3>
            <div className="space-y-3">
              {report.recommended_actions?.map((action, i) => (
                <div key={i} className="flex gap-4 p-4 bg-surface-card border border-hairline-strong rounded-[8px]">
                  <div className="w-6 h-6 rounded-full bg-surface-deep flex items-center justify-center text-ink text-[12px] shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[14px] text-ink">{action}</p>
                </div>
              ))}
              {(!report.recommended_actions || report.recommended_actions.length === 0) && (
                <p className="text-charcoal text-[14px]">No specific actions recommended.</p>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
