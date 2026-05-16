"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Terminal, Shield, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="w-full flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-hairline-strong h-[calc(100vh-64px)] sticky top-[64px] bg-canvas hidden md:block overflow-y-auto">
        <div className="p-6">
          <h4 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-4">Getting Started</h4>
          <ul className="space-y-3 mb-8">
            <li><a href="#introduction" className="text-[14px] text-ink font-medium">Introduction</a></li>
            <li><a href="#quickstart" className="text-[14px] text-charcoal hover:text-ink transition-colors">Quickstart</a></li>
            <li><a href="#authentication" className="text-[14px] text-charcoal hover:text-ink transition-colors">Authentication</a></li>
          </ul>

          <h4 className="text-[12px] font-bold text-mute uppercase tracking-wider mb-4">API Reference</h4>
          <ul className="space-y-3">
            <li><a href="#post-audit" className="text-[14px] text-charcoal hover:text-ink transition-colors">POST /v1/audit</a></li>
            <li><a href="#get-status" className="text-[14px] text-charcoal hover:text-ink transition-colors">GET /v1/audit/&#123;id&#125;/status</a></li>
            <li><a href="#get-report" className="text-[14px] text-charcoal hover:text-ink transition-colors">GET /v1/audit/&#123;id&#125;</a></li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-12">
        <div className="mb-16" id="introduction">
          <Badge className="mb-4">Documentation</Badge>
          <h1 className="font-playfair text-[48px] text-ink leading-tight mb-4">TariffGuard API</h1>
          <p className="font-inter text-[16px] text-charcoal leading-relaxed">
            Welcome to the TariffGuard AI API documentation. Our RESTful API allows you to integrate autonomous customs compliance checking directly into your ERP, WMS, or eCommerce checkout flows. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card level={1} className="p-6">
            <Terminal className="w-6 h-6 text-accent-blue mb-4" />
            <h3 className="font-inter font-medium text-ink mb-2">Developer Friendly</h3>
            <p className="text-[14px] text-charcoal">Simple REST endpoints with predictable JSON responses. Standard HTTP codes.</p>
          </Card>
          <Card level={1} className="p-6">
            <Zap className="w-6 h-6 text-accent-yellow mb-4" />
            <h3 className="font-inter font-medium text-ink mb-2">Asynchronous Engine</h3>
            <p className="text-[14px] text-charcoal">Non-blocking background processing via webhooks or simple status polling.</p>
          </Card>
        </div>

        <div className="mb-16" id="authentication">
          <h2 className="font-playfair text-[32px] text-ink mb-4 border-b border-hairline-strong pb-2">Authentication</h2>
          <p className="text-[14px] text-charcoal mb-4">
            Authenticate your API requests by including your API key in the Authorization header of every request.
          </p>
          <Card level={3} className="p-4 mb-4 overflow-x-auto border-l-4 border-l-accent-blue">
            <pre className="font-geist-mono text-[13px] text-ink">
              <code>Authorization: Bearer tg_live_xxxxxxxxxxxxxxxxx</code>
            </pre>
          </Card>
        </div>

        <div className="mb-16" id="post-audit">
          <h2 className="font-playfair text-[32px] text-ink mb-4 border-b border-hairline-strong pb-2">Create an Audit</h2>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="worker">POST</Badge>
            <span className="font-geist-mono text-[14px] text-ink">/api/v1/audit</span>
          </div>
          <p className="text-[14px] text-charcoal mb-6">
            Initiates a new background audit process for a given product and shipment scenario.
          </p>
          
          <h4 className="font-inter font-medium text-ink text-[14px] mb-3">Request Body</h4>
          <Card level={3} className="p-4 mb-8 overflow-x-auto">
            <pre className="font-geist-mono text-[13px] text-charcoal">
              <code>
{`{
  "product_name": "Industrial Servo Motor",
  "technical_description": "24V DC motor, 5000 RPM, stainless steel casing",
  "material_composition": "Steel, Copper, Neodymium",
  "intended_use": "Manufacturing automation robotics",
  "origin_country": "US",
  "destination_country": "DE",
  "shipment_value": 25000
}`}
              </code>
            </pre>
          </Card>

          <h4 className="font-inter font-medium text-ink text-[14px] mb-3">Response (202 Accepted)</h4>
          <Card level={3} className="p-4 overflow-x-auto">
            <pre className="font-geist-mono text-[13px] text-charcoal">
              <code>
{`{
  "audit_id": "aud_8f92j2k1m",
  "status": "processing",
  "message": "Audit dispatched to CrewAI cluster."
}`}
              </code>
            </pre>
          </Card>
        </div>
      </main>
    </div>
  );
}
