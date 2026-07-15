"use client";

import { useEffect, useState } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { getCustomerDetail, setCustomerTags } from "@/app/actions/crm";
import type { CustomerDetail } from "@/types/crmType";
import { getTagLabel, SUGGESTED_MANUAL_TAGS } from "@/types/crmType";

interface CustomerDetailModalProps {
  email: string | null;
  onClose: () => void;
  onTagsSaved?: () => void;
}

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

export default function CustomerDetailModal({ email, onClose, onTagsSaved }: CustomerDetailModalProps) {
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      const res = await getCustomerDetail(email);
      if ("error" in res) {
        setError(res.error);
      } else if (!res.success) {
        setError("Failed to load customer");
      } else {
        setDetail(res.data);
        setTags(res.data.tags);
        setNotes(res.data.notes);
      }
      setIsLoading(false);
    })();
  }, [email]);

  const addTag = (tag: string) => {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, "_");
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSave = async () => {
    if (!email) return;
    setSaving(true);
    setSaveError(null);
    const res = await setCustomerTags(email, tags, notes);
    setSaving(false);
    if ("error" in res) {
      setSaveError(res.error);
      return;
    }
    onTagsSaved?.();
  };

  if (!email) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F0F0F] border border-[#2a2a2a] p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              {isLoading ? "Loading…" : detail?.fullName || email}
            </h2>
            <p className="text-sm text-[#9F9FA9]">{email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoClose size={22} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cca33a]" />
          </div>
        ) : error || !detail ? (
          <p className="text-sm text-[#9F9FA9] py-8 text-center">{error || "Customer not found"}</p>
        ) : (
          <>
            {/* Tags */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#cca33a]/10 text-[#cca33a] border border-[#cca33a]/30"
                  >
                    {getTagLabel(tag)}
                    <button onClick={() => removeTag(tag)} className="hover:text-white">
                      <IoClose size={12} />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && <span className="text-xs text-[#6F6F6F]">No tags yet</span>}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag(newTag)}
                  placeholder="Add a custom tag (e.g. vendor, press)"
                  className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600"
                />
                <button
                  onClick={() => addTag(newTag)}
                  className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#2a2a2a]"
                >
                  <IoAdd size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_MANUAL_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="text-xs px-2 py-1 rounded-full border border-[#2a2a2a] text-[#9F9FA9] hover:border-[#cca33a] hover:text-[#cca33a]"
                  >
                    + {getTagLabel(tag)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Internal notes about this buyer…"
                className="w-full bg-transparent border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-600 resize-none"
              />
            </div>

            {saveError && <p className="text-red-500 text-sm mb-3">{saveError}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mb-6 py-2 rounded-lg bg-[#cca33a] text-black text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Tags & Notes"}
            </button>

            {/* Purchase history */}
            <div>
              <p className="text-sm font-medium mb-3">
                Purchase History ({detail.totalTransactions})
              </p>
              <div className="space-y-2">
                {detail.history.map((item) => (
                  <div
                    key={item.transactionId}
                    className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">{item.eventTitle}</p>
                      <p className="text-xs text-[#9F9FA9]">
                        {formatDate(item.eventDate)} · {item.txnId}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          item.checkedIn
                            ? "bg-[#0F2A1A] text-[#22C55E]"
                            : "bg-[#2A2A2A] text-[#9F9FA9]"
                        }`}
                      >
                        {item.checkedIn ? "Checked In" : "Not Checked In"}
                      </span>
                      <p className="text-xs text-[#6F6F6F] mt-1">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}