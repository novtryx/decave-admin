"use client";

import {
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
  FaFacebook,
  FaTiktok,
  FaGoogle,
  FaLink,
  FaCircleQuestion,
} from "react-icons/fa6";
import type { TrafficSourceRow } from "@/app/actions/analytics";

const SOURCE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  instagram: { label: "Instagram", icon: FaInstagram, color: "#E1306C" },
  whatsapp: { label: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
  twitter: { label: "Twitter / X", icon: FaXTwitter, color: "#FFFFFF" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "#1877F2" },
  tiktok: { label: "TikTok", icon: FaTiktok, color: "#FFFFFF" },
  google: { label: "Google", icon: FaGoogle, color: "#EA4335" },
  direct: { label: "Direct / Link", icon: FaLink, color: "#9F9FA9" },
  other: { label: "Other", icon: FaCircleQuestion, color: "#9F9FA9" },
};

function sourceMeta(source: string) {
  return SOURCE_META[source] || SOURCE_META.other;
}

export default function TrafficSources({
  totalVisits,
  sources,
}: {
  totalVisits: number;
  sources: TrafficSourceRow[];
}) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-white">Traffic Sources</h3>
        <span className="text-xs text-[#9F9FA9]">{totalVisits} total visits</span>
      </div>
      <p className="text-xs text-[#6F6F6F] mb-6">
        Where visitors landed on this event's page from, and how many went on to buy a ticket.
      </p>

      {sources.length === 0 ? (
        <p className="text-sm text-[#6F6F6F]">No visits recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {/* Stacked share bar */}
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#2a2a2a]">
            {sources.map((row) => {
              const meta = sourceMeta(row.source);
              return (
                <div
                  key={row.source}
                  style={{ width: `${row.sharePercent}%`, backgroundColor: meta.color }}
                  title={`${meta.label}: ${row.sharePercent}%`}
                />
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                  <th className="py-2 pr-4">Source</th>
                  <th className="py-2 pr-4">Visits</th>
                  <th className="py-2 pr-4">Share</th>
                  <th className="py-2 pr-4">Purchases</th>
                  <th className="py-2 pr-4">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((row) => {
                  const meta = sourceMeta(row.source);
                  const Icon = meta.icon;
                  return (
                    <tr key={row.source} className="border-b border-[#2a2a2a]/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Icon style={{ color: meta.color }} className="text-base shrink-0" />
                          <span className="text-white font-medium">{meta.label}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[#9F9FA9]">{row.visits}</td>
                      <td className="py-3 pr-4 text-[#9F9FA9]">{row.sharePercent}%</td>
                      <td className="py-3 pr-4 text-[#9F9FA9]">{row.purchases}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#111111] text-[#cca33a]">
                          {row.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}