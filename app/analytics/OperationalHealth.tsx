interface OperationalHealthProps {
  paymentHealth: {
    totalCompleted: number;
    totalPending: number;
    totalFailed: number;
  };
  ticketSaleWindow: {
    onSale: number;
    notYetOpen: number;
    closed: number;
    noWindowSet: number;
  };
  influencer: {
    influencerRevenue: number;
    organicRevenue: number;
  };
}

function SegmentedBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div>
      <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#2a2a2a]">
        {total === 0 ? (
          <div className="w-full h-full bg-[#2a2a2a]" />
        ) : (
          segments.map((s) => (
            <div
              key={s.label}
              className={s.color}
              style={{ width: `${(s.value / total) * 100}%` }}
            />
          ))
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-[#B3B3B3]">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              {s.label}
            </span>
            <span className="text-[#F4F4F5] font-medium">
              {s.value.toLocaleString()}
              {total > 0 && (
                <span className="text-[#6F6F6F] ml-1">
                  ({((s.value / total) * 100).toFixed(0)}%)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OperationalHealth({
  paymentHealth,
  ticketSaleWindow,
  influencer,
}: OperationalHealthProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Operational Health</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Health */}
        <div>
          <p className="text-sm text-[#9F9FA9] mb-3">Transaction Outcomes</p>
          <SegmentedBar
            segments={[
              { label: "Completed", value: paymentHealth.totalCompleted, color: "bg-green-500" },
              { label: "Pending", value: paymentHealth.totalPending, color: "bg-amber-500" },
              { label: "Failed", value: paymentHealth.totalFailed, color: "bg-red-500" },
            ]}
          />
        </div>

        {/* Ticket Sale Window */}
        <div>
          <p className="text-sm text-[#9F9FA9] mb-3">Ticket Sale Status</p>
          <SegmentedBar
            segments={[
              { label: "On sale", value: ticketSaleWindow.onSale, color: "bg-blue-500" },
              { label: "Not yet open", value: ticketSaleWindow.notYetOpen, color: "bg-purple-500" },
              { label: "Closed", value: ticketSaleWindow.closed, color: "bg-gray-500" },
              { label: "No window set", value: ticketSaleWindow.noWindowSet, color: "bg-zinc-600" },
            ]}
          />
        </div>

        {/* Influencer vs Organic */}
        <div>
          <p className="text-sm text-[#9F9FA9] mb-3">Revenue Source</p>
          <SegmentedBar
            segments={[
              { label: "Influencer referral", value: influencer.influencerRevenue, color: "bg-[#cca33a]" },
              { label: "Organic", value: influencer.organicRevenue, color: "bg-sky-500" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}