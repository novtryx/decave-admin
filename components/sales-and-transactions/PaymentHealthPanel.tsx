"use client";

import { useEffect, useState } from "react";
import { getPendingPaymentAging, getAbandonedCheckouts } from "@/app/actions/transaction";
import type { PendingAgingResponse, AbandonedCheckout } from "@/types/transactionsType";

const BUCKET_LABELS: { key: keyof PendingAgingResponse["buckets"]; label: string; color: string }[] = [
  { key: "under5Min", label: "Under 5 min", color: "text-[#22C55E]" },
  { key: "fiveMinTo1Hour", label: "5 min – 1 hr", color: "text-[#F59E0B]" },
  { key: "oneHourTo6Hours", label: "1 hr – 6 hrs", color: "text-[#F59E0B]" },
  { key: "sixHoursTo24Hours", label: "6 hrs – 24 hrs", color: "text-[#EF4444]" },
  { key: "expired", label: "Expired (24 hrs+)", color: "text-[#EF4444]" },
];

export default function PaymentHealthPanel() {
  const [aging, setAging] = useState<PendingAgingResponse | null>(null);
  const [abandoned, setAbandoned] = useState<AbandonedCheckout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAbandoned, setShowAbandoned] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [agingRes, abandonedRes] = await Promise.all([
        getPendingPaymentAging(),
        getAbandonedCheckouts(1, 10),
      ]);
      if (!("error" in agingRes)) setAging(agingRes);
      if (!("error" in abandonedRes)) setAbandoned(abandonedRes.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6 animate-pulse h-32" />
    );
  }

  if (!aging || aging.totalPending === 0) {
    return null;
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Pending Payment Aging{" "}
          <span className="text-sm font-normal text-[#9F9FA9]">
            ({aging.totalPending} pending)
          </span>
        </h3>
        {abandoned.length > 0 && (
          <button
            onClick={() => setShowAbandoned((s) => !s)}
            className="text-sm text-[#cca33a] hover:underline"
          >
            {showAbandoned ? "Hide" : "View"} abandoned checkouts ({abandoned.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {BUCKET_LABELS.map(({ key, label, color }) => (
          <div key={key} className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-3">
            <div className={`text-2xl font-bold ${color}`}>{aging.buckets[key].count}</div>
            <div className="text-xs text-[#9F9FA9] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {showAbandoned && (
        <div className="mt-5 border-t border-[#2a2a2a] pt-4">
          <p className="text-xs text-[#6F6F6F] mb-3">
            Still pending past 30 minutes — good candidates for a recovery email/WhatsApp nudge.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Buyer</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Age</th>
                </tr>
              </thead>
              <tbody>
                {abandoned.map((item) => (
                  <tr key={item.txnId} className="border-b border-[#2a2a2a]/50">
                    <td className="py-2 pr-4 text-white">{item.eventTitle}</td>
                    <td className="py-2 pr-4 text-[#9F9FA9]">{item.buyers?.[0]?.fullName}</td>
                    <td className="py-2 pr-4 text-[#9F9FA9]">{item.buyers?.[0]?.email}</td>
                    <td className="py-2 pr-4 text-[#9F9FA9]">{item.buyers?.[0]?.phoneNumber}</td>
                    <td className="py-2 pr-4 text-[#9F9FA9]">
                      {item.ageMinutes < 60
                        ? `${item.ageMinutes}m`
                        : `${Math.round(item.ageMinutes / 60)}h`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}