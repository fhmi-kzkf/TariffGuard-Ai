"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string, apiKey: string) => 
  fetch(url, {
    headers: {
      "X-API-Key": apiKey
    }
  }).then(r => r.json());

export default function History() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const apiKey = process.env.NEXT_PUBLIC_BACKEND_SECRET_KEY || "super-secret-default";
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR([`${apiUrl}/api/v1/audits?limit=10&page=${page}`, apiKey], ([url, key]) => fetcher(url, key));

  return (
    <div className="max-w-7xl mx-auto px-8 py-[48px] w-full">
      <div className="flex items-center justify-between mb-[48px]">
        <div>
          <h1 className="font-playfair text-[48px] text-ink leading-tight">Audit History</h1>
          <p className="font-inter text-[16px] text-charcoal">Complete log of all autonomous compliance audits.</p>
        </div>
        <Button variant="outline">
          Export CSV
        </Button>
      </div>

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
                  <td colSpan={6} className="px-6 py-8 text-center text-charcoal">Loading history...</td>
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
        <div className="flex items-center justify-between p-4 border-t border-hairline-strong bg-canvas">
          <span className="text-charcoal text-[14px]">Total records: {data?.total || 0}</span>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="ghost" disabled={!data?.data || data.data.length < 10} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
