"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { createFinanceEntry } from "@/app/actions/finance";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryLabel, FinanceEntryType } from "@/types/financeType";
import type { Event } from "@/types/eventsType";

interface AddFinanceEntryModalProps {
  isOpen: boolean;
  events: Event[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AddFinanceEntryModal({ isOpen, events, onClose, onSaved }: AddFinanceEntryModalProps) {
  const [type, setType] = useState<FinanceEntryType>("debit");
  const [eventId, setEventId] = useState("");
  const [category, setCategory] = useState<string>("venue");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = type === "debit" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: FinanceEntryType) => {
    setType(newType);
    setCategory(newType === "debit" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const resetAndClose = () => {
    setType("debit");
    setEventId("");
    setCategory("venue");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    if (!amount || Number(amount) <= 0) {
      setError("Enter an amount greater than 0");
      return;
    }

    setSaving(true);
    const res = await createFinanceEntry({
      eventId: eventId || null,
      type,
      category,
      amount: Number(amount),
      currency: "NGN",
      description,
      date,
    });
    setSaving(false);

    if ("error" in res) {
      setError(res.error);
      return;
    }
    if (!res.success) {
      setError(res.message);
      return;
    }

    onSaved();
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0F0F0F] border border-[#2a2a2a] p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Add Finance Entry</h2>
          <button onClick={resetAndClose} className="text-gray-400 hover:text-white">
            <IoClose size={22} />
          </button>
        </div>

        {/* Credit / Debit toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleTypeChange("debit")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === "debit" ? "bg-[#EF4444] text-white" : "bg-[#1a1a1a] text-[#9F9FA9] border border-[#2a2a2a]"
            }`}
          >
            Debit (Money Out)
          </button>
          <button
            onClick={() => handleTypeChange("credit")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === "credit" ? "bg-[#22C55E] text-black" : "bg-[#1a1a1a] text-[#9F9FA9] border border-[#2a2a2a]"
            }`}
          >
            Credit (Money In)
          </button>
        </div>

        {/* Event */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Event</label>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
          >
            <option value="" className="bg-[#111111]">General (not tied to an event)</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id} className="bg-[#111111]">
                {ev.eventDetails.eventTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#111111]">
                {getCategoryLabel(c)}
              </option>
            ))}
          </select>
        </div>

        {/* Amount + Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm mb-2">Amount (₦)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm mb-2">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="e.g. Deposit for venue hall"
            className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-600 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-3 rounded-lg bg-[#cca33a] text-black text-sm font-semibold disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Entry"}
        </button>
      </div>
    </div>
  );
}