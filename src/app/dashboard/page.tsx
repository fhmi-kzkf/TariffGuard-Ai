"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Dashboard() {
  // We'll use our local backend default if env is not provided.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/v1/audits?limit=5`, fetcher);

  const stats = {
    total: data?.total || 0,
    compliant: data?.data?.filter((a: any) => a.status === "complete")?.length || 0,
    nonCompliant: 0,
    avgRiskScore: "LOW",
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-[48px] w-full">
      <div className="flex items-center justify-between mb-[48px]">
        <div>
          <h1 className="font-playfair text-[48px] text-ink leading-tight">Dashboard</h1>
          <p className="font-inter text-[16px] text-charcoal">Overview of your recent autonomous compliance audits.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/audit/new">New Audit</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-[48px]">
        <Card level={1} className="p-[20px]">
          <h3 className="font-inter text-[14px] text-mute mb-2">Total Audits</h3>
          <p className="font-inter-tight text-[32px] text-ink">{stats.total}</p>
        </Card>
        <Card level={1} className="p-[20px]">
          <h3 className="font-inter text-[14px] text-mute mb-2">Compliant</h3>
          <p className="font-inter-tight text-[32px] text-accent-green">{stats.compliant}</p>
        </Card>
        <Card level={1} className="p-[20px]">
          <h3 className="font-inter text-[14px] text-mute mb-2">Non-Compliant</h3>
          <p className="font-inter-tight text-[32px] text-accent-red">{stats.nonCompliant}</p>
        </Card>
        <Card level={1} className="p-[20px]">
          <h3 className="font-inter text-[14px] text-mute mb-2">Avg Risk Score</h3>
          <p className="font-inter-tight text-[32px] text-accent-yellow">{stats.avgRiskScore}</p>
        </Card>
      </div>

      <h2 className="font-inter text-[20px] font-medium text-ink mb-6">Recent Audits</h2>
      <Card level={1} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-[14px]">
            <thead className="text-mute border-b border-hairline-strong bg-canvas">
              <tr>
                <th className="px-6 py-4 font-medium">Audit ID</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-strong bg-canvas">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-charcoal">Loading recent audits...</td>
                </tr>
              )}
              {!isLoading && (!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-charcoal">No audits found.</td>
                </tr>
              )}
              {data?.data?.map((audit: any) => (
                <tr key={audit.id} className="hover:bg-surface-card transition-colors">
                  <td className="px-6 py-4 text-charcoal font-geist-mono text-[13px]">
                    {audit.id.substring(0, 18)}...
                  </td>
                  <td className="px-6 py-4 text-ink font-medium">{audit.product_name}</td>
                  <td className="px-6 py-4 text-charcoal">{audit.destination_country}</td>
                  <td className="px-6 py-4">
                    <Badge variant={audit.status === "complete" ? "compliant" : audit.status === "processing" ? "medium" : "default"}>
                      {audit.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-charcoal">{new Date(audit.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/audit/${audit.id}`} className="text-accent-blue hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
