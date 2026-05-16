"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Search, ScanBarcode, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const titleText = "Autonomous Tariff Compliance";

  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1: HERO BAND */}
      <section className="relative w-full px-8 py-[128px] overflow-hidden">
        <div className="absolute inset-0 glow-orange -z-10 pointer-events-none opacity-80" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-8 font-inter">AI-Powered Customs Intelligence</Badge>
          </motion.div>
          
          {/* Typing Animation */}
          <h1 className="font-playfair text-[56px] md:text-[96px] leading-[1.0] tracking-[-0.96px] text-ink max-w-[800px] mb-6 flex flex-wrap justify-center">
            {mounted && titleText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, display: "none" }}
                animate={{ opacity: 1, display: "inline-block" }}
                transition={{ duration: 0.05, delay: index * 0.04 }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            {!mounted && titleText}
          </h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.5, duration: 0.8 }}
            className="font-inter text-[18px] md:text-[20px] leading-[1.5] text-body-text max-w-[600px] mb-12"
          >
            Eliminate costly HS Code errors and catch regulatory changes before they cost you millions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 1.8, duration: 0.5 }}
            className="flex items-center gap-4 mb-[96px]"
          >
            <Button variant="primary" asChild className="h-[44px] px-[24px]">
              <Link href="/audit/new">Start Free Audit</Link>
            </Button>
            <Button variant="ghost" className="h-[44px] px-[24px]">
              View Sample Report
            </Button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
          >
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[24px] flex flex-col items-start text-left h-full">
                <span className="font-inter-tight text-[48px] text-ink leading-tight">$4.2M</span>
                <span className="font-inter text-[14px] text-mute">Average annual loss from misclassification</span>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[24px] flex flex-col items-start text-left h-full">
                <span className="font-inter-tight text-[48px] text-ink leading-tight">94%</span>
                <span className="font-inter text-[14px] text-mute">Classification accuracy rate</span>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[24px] flex flex-col items-start text-left h-full">
                <span className="font-inter-tight text-[48px] text-ink leading-tight">&lt;30s</span>
                <span className="font-inter text-[14px] text-mute">Full audit generation time</span>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section className="relative w-full px-8 py-[96px]">
        <div className="absolute inset-0 glow-blue -z-10 pointer-events-none opacity-60" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto flex flex-col items-center text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-6">Multi-Agent Workflow</Badge>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-playfair text-[48px] md:text-[76px] leading-[1.0] tracking-[-0.768px] text-ink mb-[96px]">
            Three agents. One verdict.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[32px] relative flex flex-col items-start text-left group hover:bg-surface-elevated transition-colors h-full">
                <Badge variant="worker" className="absolute top-6 right-6">Worker</Badge>
                <div className="p-3 rounded-lg bg-surface-deep mb-6">
                  <Search className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="font-inter text-[24px] font-medium text-ink mb-3">Customs Scraper</h3>
                <p className="font-inter text-[16px] text-charcoal">Real-time tariff data from 180+ customs authorities</p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[32px] relative flex flex-col items-start text-left group hover:bg-surface-elevated transition-colors h-full">
                <Badge variant="worker" className="absolute top-6 right-6">Worker</Badge>
                <div className="p-3 rounded-lg bg-surface-deep mb-6">
                  <ScanBarcode className="w-6 h-6 text-accent-blue" />
                </div>
                <h3 className="font-inter text-[24px] font-medium text-ink mb-3">Product Classifier</h3>
                <p className="font-inter text-[16px] text-charcoal">HS Code matching against 5,000+ nomenclature entries</p>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card level={1} className="p-[32px] relative flex flex-col items-start text-left group hover:bg-surface-elevated transition-colors h-full">
                <Badge variant="manager" className="absolute top-6 right-6">Manager</Badge>
                <div className="p-3 rounded-lg bg-surface-deep mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#ff5900]" />
                </div>
                <h3 className="font-inter text-[24px] font-medium text-ink mb-3">Legal Auditor</h3>
                <p className="font-inter text-[16px] text-charcoal">Cross-validates, calculates penalty exposure, drafts report</p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: LIVE CODE WINDOW */}
      <section className="relative w-full px-8 py-[96px] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <h2 className="font-playfair text-[48px] md:text-[76px] leading-[1.0] tracking-[-0.768px] text-ink mb-6">
              Integrate this weekend
            </h2>
            <p className="font-inter text-[18px] text-body-text mb-8 max-w-[480px]">
              Our simple REST API allows you to plug autonomous compliance checks directly into your ERP, WMS, or checkout flow.
            </p>
            <Button variant="ghost">View Docs</Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full"
          >
            <Card level={3} className="overflow-hidden shadow-2xl flex flex-col w-full border-hairline-strong/30">
              <div className="h-10 border-b border-hairline-strong flex items-center px-4 justify-between bg-[#0a0a0c]">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full bg-accent-red" />
                  <div className="w-[10px] h-[10px] rounded-full bg-accent-yellow" />
                  <div className="w-[10px] h-[10px] rounded-full bg-accent-green" />
                </div>
                <div className="flex gap-4">
                  <span className="text-[12px] text-ink font-medium">Python</span>
                  <span className="text-[12px] text-charcoal">Node.js</span>
                  <span className="text-[12px] text-charcoal">cURL</span>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-geist-mono text-[13px] leading-[1.6] text-charcoal">
                  <code>
<span className="text-[#c678dd]">import</span> requests{'\n\n'}
payload = {'{\n'}
  <span className="text-[#98c379]">"product_name"</span>: <span className="text-[#98c379]">"Industrial Widget"</span>,{'\n'}
  <span className="text-[#98c379]">"origin_country"</span>: <span className="text-[#98c379]">"US"</span>,{'\n'}
  <span className="text-[#98c379]">"destination_country"</span>: <span className="text-[#98c379]">"DE"</span>,{'\n'}
  <span className="text-[#98c379]">"shipment_value"</span>: <span className="text-[#d19a66]">25000</span>{'\n'}
{'}'}{'\n\n'}
response = requests.post({'\n'}
  <span className="text-[#98c379]">"https://api.tariffguard.ai/v1/audit"</span>,{'\n'}
  json=payload,{'\n'}
  headers=<span className="text-[#e5c07b]">{"{"}</span><span className="text-[#98c379]">"Authorization"</span>: <span className="text-[#98c379]">"Bearer YOUR_API_KEY"</span><span className="text-[#e5c07b]">{"}"}</span>{'\n'}
){'\n\n'}
<span className="text-[#e5c07b]">print</span>(response.json())
                  </code>
                </pre>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: SAMPLE REPORT INSET */}
      <section className="relative w-full px-8 py-[128px]">
        <div className="absolute inset-0 glow-green -z-10 pointer-events-none opacity-40" />
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[640px] mx-auto bg-[#fcfdff] rounded-[12px] p-[32px] text-[#000000] shadow-2xl"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-inter text-[20px] font-bold tracking-tight mb-1">Audit Report TGCA-2026-X8F</h3>
              <p className="text-[14px] text-[#666]">Generated autonomously in 28s</p>
            </div>
            <span className="px-3 py-1 bg-[#11ff99]/20 text-[#00a85d] font-bold text-[12px] rounded-full border border-[#11ff99]/40">
              COMPLIANT ✅
            </span>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[14px] uppercase tracking-wide text-[#888] mb-2">HS Code Decision</h4>
              <p className="font-inter-tight text-[32px] font-medium leading-none mb-1">8471.30.0000</p>
              <p className="text-[14px] text-[#444]">Portable automatic data processing machines</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0f0f0] p-4 rounded-lg">
                <p className="text-[12px] text-[#666] mb-1">Risk Level</p>
                <p className="font-bold text-[#00a85d]">LOW</p>
              </div>
              <div className="bg-[#f0f0f0] p-4 rounded-lg">
                <p className="text-[12px] text-[#666] mb-1">Duty Exposure</p>
                <p className="font-bold text-[#000]">$0.00 (FTA Applicable)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
