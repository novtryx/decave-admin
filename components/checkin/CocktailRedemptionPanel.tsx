"use client";

import { useState } from "react";
import { IoWineOutline } from "react-icons/io5";
import { lookupCocktailOrder, redeemCocktails } from "@/app/actions/checkin";
import { CocktailOrderLookup, CocktailRedeemResponse } from "@/types/checkinType";
import QRScanner from "./QRScanner";

export default function CocktailRedemptionPanel() {
  const [order, setOrder] = useState<CocktailOrderLookup | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);

  // What staff have selected to hand over THIS visit — keyed by
  // cocktailId. Reset every time a new order is looked up.
  const [selections, setSelections] = useState<Record<string, number>>({});

  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<CocktailRedeemResponse | { error: string } | null>(null);

  const handleScan = async (code: string) => {
    setLooking(true);
    setLookupError(null);
    setOrder(null);
    setSelections({});
    setRedeemResult(null);

    const res = await lookupCocktailOrder(code);
    setLooking(false);

    if ("error" in res) {
      setLookupError(res.error);
      return;
    }
    if (!res.success) {
      setLookupError("Could not read this order");
      return;
    }
    setOrder(res.data);
  };

  const adjustSelection = (cocktailId: string, delta: number, remaining: number) => {
    setSelections((prev) => {
      const current = prev[cocktailId] || 0;
      const next = Math.max(0, Math.min(remaining, current + delta));
      return { ...prev, [cocktailId]: next };
    });
  };

  const totalSelected = Object.values(selections).reduce((sum, qty) => sum + qty, 0);

  const handleRedeem = async () => {
    if (!order) return;
    const redemptions = Object.entries(selections)
      .filter(([, qty]) => qty > 0)
      .map(([cocktailId, quantity]) => ({ cocktailId, quantity }));

    if (redemptions.length === 0) return;

    setRedeeming(true);
    const res = await redeemCocktails(order.txnId, redemptions);
    setRedeeming(false);
    setRedeemResult(res);

    if (!("error" in res) && res.success) {
      // Refresh from the authoritative server response — this keeps
      // remaining counts correct even if two staff scan the same
      // order around the same time.
      setOrder({ ...order, items: res.data.items });
      setSelections({});
    }
  };

  const startNewScan = () => {
    setOrder(null);
    setLookupError(null);
    setSelections({});
    setRedeemResult(null);
  };

  return (
    <div className="space-y-6">
      {!order ? (
        <>
          <QRScanner onScan={handleScan} disabled={looking} />
          {looking && <p className="text-sm text-[#9F9FA9] text-center">Looking up order…</p>}
          {lookupError && (
            <div className="px-4 py-3 rounded-lg bg-[#2A0F0F] text-[#EF4444] text-sm">{lookupError}</div>
          )}
        </>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <IoWineOutline /> {order.buyerName}
            </h3>
            <span className="text-xs text-[#6F6F6F]">{order.txnId}</span>
          </div>
          <p className="text-xs text-[#9F9FA9] mb-5">{order.eventTitle}</p>

          {redeemResult && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                "error" in redeemResult ? "bg-[#2A0F0F] text-[#EF4444]" : "bg-[#0F2A1A] text-[#22C55E]"
              }`}
            >
              {"error" in redeemResult ? redeemResult.error : "✓ Drinks redeemed"}
            </div>
          )}

          {/* Every drink type on the order, with remaining count and a
              stepper — this is the "select the exact one they're
              taking" piece, for when someone ordered several kinds. */}
          <div className="space-y-3 mb-5">
            {order.items.map((item) => {
              const selected = selections[item.cocktailId] || 0;
              const soldOut = item.remaining === 0;
              return (
                <div
                  key={item.cocktailId}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    soldOut ? "border-[#2a2a2a] opacity-50" : "border-[#2a2a2a]"
                  }`}
                >
                  <div>
                    <p className="text-sm text-white font-medium">{item.name}</p>
                    <p className="text-xs text-[#6F6F6F]">
                      {item.remaining} of {item.quantity} remaining
                      {item.redeemedQuantity > 0 && ` · ${item.redeemedQuantity} already redeemed`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adjustSelection(item.cocktailId, -1, item.remaining)}
                      disabled={selected === 0}
                      className="w-8 h-8 rounded-lg bg-[#111111] border border-[#2a2a2a] text-white disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-white text-sm">{selected}</span>
                    <button
                      onClick={() => adjustSelection(item.cocktailId, 1, item.remaining)}
                      disabled={selected >= item.remaining}
                      className="w-8 h-8 rounded-lg bg-[#111111] border border-[#2a2a2a] text-white disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={startNewScan}
              className="px-4 py-2.5 rounded-lg bg-[#111111] border border-[#2a2a2a] text-white text-sm"
            >
              Scan Another
            </button>
            <button
              onClick={handleRedeem}
              disabled={totalSelected === 0 || redeeming}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#cca33a] text-black text-sm font-semibold disabled:opacity-40"
            >
              {redeeming
                ? "Redeeming…"
                : totalSelected === 0
                ? "Select drinks to redeem"
                : `Redeem ${totalSelected} drink${totalSelected > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}