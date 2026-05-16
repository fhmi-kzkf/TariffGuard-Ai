"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useSWR from "swr";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Clock, Globe, Scale, ScanBarcode } from "lucide-react";

const formSchema = z.object({
  product_name: z.string().min(2, "Required"),
  technical_description: z.string().min(10, "Provide detailed specs"),
  material_composition: z.string().min(2, "Required"),
  intended_use: z.string().min(2, "Required"),
  origin_country: z.string().length(2, "Must be 2-letter ISO code"),
  destination_country: z.string().length(2, "Must be 2-letter ISO code"),
  declared_hs_code: z.string().optional(),
  shipment_value: z.number({ message: "Required" }).min(1, "Required"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewAudit() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin_country: "US",
      destination_country: "DE",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to start audit");
      
      const resData = await res.json();
      setAuditId(resData.audit_id);
      toast.success("Audit initiated successfully");
    } catch (error) {
      toast.error("Failed to submit audit.");
      setIsSubmitting(false);
    }
  };

  // Polling logic
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: pollData } = useSWR(
    auditId ? `${apiUrl}/api/v1/audit/${auditId}/status` : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  // Redirect when audit completes or fails
  useEffect(() => {
    if (pollData?.status === "complete" || pollData?.status === "failed") {
      router.push(`/audit/${auditId}`);
    }
  }, [pollData?.status, auditId, router]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-[48px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* LEFT: FORM */}
      <div>
        <h1 className="font-playfair text-[48px] text-ink leading-tight mb-2">New Audit</h1>
        <p className="font-inter text-[16px] text-charcoal mb-8">Submit product details for autonomous compliance review.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-[14px] text-ink font-medium mb-2">Product Name</label>
            <Input {...register("product_name")} placeholder="e.g. Industrial Servo Motor" disabled={isSubmitting} />
            {errors.product_name && <p className="text-accent-red text-xs mt-1">{errors.product_name.message}</p>}
          </div>

          <div>
            <label className="block text-[14px] text-ink font-medium mb-2">Technical Description</label>
            <textarea 
              {...register("technical_description")}
              className="flex w-full h-[120px] rounded-[8px] border border-hairline-strong bg-surface-card px-[14px] py-[10px] text-[14px] text-ink placeholder:text-mute focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Specs, voltage, dimensions..."
              disabled={isSubmitting}
            />
            {errors.technical_description && <p className="text-accent-red text-xs mt-1">{errors.technical_description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Material Comp.</label>
              <Input {...register("material_composition")} placeholder="e.g. Steel, Copper" disabled={isSubmitting} />
              {errors.material_composition && <p className="text-accent-red text-xs mt-1">{errors.material_composition.message}</p>}
            </div>
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Intended Use</label>
              <Input {...register("intended_use")} placeholder="e.g. Manufacturing" disabled={isSubmitting} />
              {errors.intended_use && <p className="text-accent-red text-xs mt-1">{errors.intended_use.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Origin Country</label>
              <Select {...register("origin_country")} disabled={isSubmitting}>
                <option value="US">United States (US)</option>
                <option value="CN">China (CN)</option>
                <option value="DE">Germany (DE)</option>
                <option value="JP">Japan (JP)</option>
              </Select>
            </div>
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Destination</label>
              <Select {...register("destination_country")} disabled={isSubmitting}>
                <option value="DE">Germany (DE)</option>
                <option value="US">United States (US)</option>
                <option value="CN">China (CN)</option>
                <option value="UK">United Kingdom (UK)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Declared HS Code</label>
              <Input {...register("declared_hs_code")} placeholder="Leave blank if unknown" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-[14px] text-ink font-medium mb-2">Shipment Value (USD)</label>
              <Input {...register("shipment_value", { valueAsNumber: true })} type="number" placeholder="25000" disabled={isSubmitting} />
              {errors.shipment_value && <p className="text-accent-red text-xs mt-1">{errors.shipment_value.message}</p>}
            </div>
          </div>

          {!isSubmitting ? (
            <Button type="submit" variant="primary" className="w-full h-[44px]">Run Compliance Audit</Button>
          ) : (
            <Button disabled variant="primary" className="w-full h-[44px]">
              <Spinner className="mr-2" /> Agents are working...
            </Button>
          )}
        </form>
      </div>

      {/* RIGHT: PREVIEW / PROGRESS */}
      <div className="relative h-full min-h-[400px]">
        {!isSubmitting ? (
          <Card level={2} className="p-8 sticky top-32">
            <Badge variant="worker" className="mb-4">Instructions</Badge>
            <h3 className="font-playfair text-[24px] text-ink mb-4">How the audit works</h3>
            <ul className="space-y-4 text-[14px] text-charcoal">
              <li className="flex gap-3"><Globe className="w-5 h-5 text-accent-blue shrink-0" /> <span>Agent 1 gathers real-time trade rules from the destination country.</span></li>
              <li className="flex gap-3"><ScanBarcode className="w-5 h-5 text-accent-yellow shrink-0" /> <span>Agent 2 matches materials against 5,000+ HS Code entries.</span></li>
              <li className="flex gap-3"><Scale className="w-5 h-5 text-accent-green shrink-0" /> <span>Agent 3 calculates penalties and issues a final compliance report.</span></li>
            </ul>
          </Card>
        ) : (
          <Card level={2} className="p-8 sticky top-32 border-accent-blue/40 shadow-[0_0_40px_rgba(0,117,255,0.1)]">
            <h3 className="font-inter font-medium text-[20px] text-ink mb-6">Autonomous Processing</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-hairline-strong">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow bg-surface-deep ${pollData?.progress?.step >= 1 ? 'border-accent-blue bg-accent-blue/20' : ''}`}>
                  {pollData?.progress?.step > 1 ? <CheckCircle2 className="w-4 h-4 text-accent-blue" /> : <Clock className={`w-4 h-4 ${pollData?.progress?.step === 1 ? 'text-accent-blue animate-pulse' : 'text-mute'}`} />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-surface-card border border-hairline shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-ink text-[14px]">Customs Scraper</div>
                  </div>
                  <div className="text-charcoal text-[13px]">Fetching regulations...</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow bg-surface-deep ${pollData?.progress?.step >= 2 ? 'border-accent-yellow bg-accent-yellow/20' : ''}`}>
                  {pollData?.progress?.step > 2 ? <CheckCircle2 className="w-4 h-4 text-accent-yellow" /> : <Clock className={`w-4 h-4 ${pollData?.progress?.step === 2 ? 'text-accent-yellow animate-pulse' : 'text-mute'}`} />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-surface-card border border-hairline shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-ink text-[14px]">Product Classifier</div>
                  </div>
                  <div className="text-charcoal text-[13px]">Matching HS Codes...</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-canvas shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow bg-surface-deep ${pollData?.progress?.step >= 3 ? 'border-accent-green bg-accent-green/20' : ''}`}>
                  {pollData?.progress?.step > 3 ? <CheckCircle2 className="w-4 h-4 text-accent-green" /> : <Clock className={`w-4 h-4 ${pollData?.progress?.step === 3 ? 'text-accent-green animate-pulse' : 'text-mute'}`} />}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-surface-card border border-hairline shadow">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-ink text-[14px]">Legal Auditor</div>
                  </div>
                  <div className="text-charcoal text-[13px]">Compiling report...</div>
                </div>
              </div>

            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
