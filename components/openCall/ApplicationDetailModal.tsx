"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import {
  getApplicationDetail,
  updateApplicationStatus,
} from "@/app/actions/openCall";
import {
  ApplicationDetail,
  ApplicationStatus,
  APPLICATION_STATUSES,
  statusLabel,
} from "@/types/openCallType";
import StatusBadge from "./StatusBadge";

interface ApplicationDetailModalProps {
  applicationId: string | null;
  onClose: () => void;
  onStatusChanged?: () => void;
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

function formatAnswerValue(value: any): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

export default function ApplicationDetailModal({
  applicationId,
  onClose,
  onStatusChanged,
}: ApplicationDetailModalProps) {
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | "">("");
  const [reviewNote, setReviewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      setDetail(null);
      const res = await getApplicationDetail(applicationId);
      if ("error" in res) {
        setError(res.error);
      } else if (!res.success) {
        setError("Failed to load application");
      } else {
        setDetail(res.data);
        setPendingStatus(res.data.status);
        setReviewNote(res.data.reviewNote || "");
      }
      setIsLoading(false);
    })();
  }, [applicationId]);

  if (!applicationId) return null;

  const handleSaveStatus = async () => {
    if (!detail || !pendingStatus) return;
    setSaving(true);
    setSaveError(null);
    const res = await updateApplicationStatus(detail._id, pendingStatus, reviewNote);
    setSaving(false);
    if ("error" in res) {
      setSaveError(res.error);
      return;
    }
    if (!res.success) {
      setSaveError("Failed to update status");
      return;
    }
    onStatusChanged?.();
  };

  // Answers are matched back to their field definition (label, order,
  // type) via the category config that comes attached to the
  // application — this is what lets one modal render any of the 8
  // categories' answers correctly without category-specific code.
  const orderedFields = detail
    ? [...detail.category.fields].sort((a, b) => a.order - b.order)
    : [];
  const answerMap = new Map((detail?.answers || []).map((a) => [a.fieldName, a.value]));
  const fileMap = new Map((detail?.files || []).map((f) => [f.fieldName, f]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111111] border-b border-[#2a2a2a] p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-white">Application Review</h2>
            {detail && <p className="text-xs text-[#9F9FA9] mt-0.5">{detail.category.name}</p>}
          </div>
          <button onClick={onClose} className="text-[#9F9FA9] hover:text-white p-1">
            <IoClose size={22} />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cca33a]" />
            </div>
          ) : error ? (
            <p className="text-center py-16 text-[#9F9FA9]">{error}</p>
          ) : detail ? (
            <div className="space-y-6">
              {/* Applicant */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#cca33a] text-sm font-semibold uppercase tracking-wide">
                    Applicant
                  </h3>
                  <StatusBadge status={detail.status} />
                </div>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
                  <DetailRow label="Name" value={detail.applicant.fullName} />
                  <DetailRow label="Email" value={detail.applicant.email} />
                  <DetailRow label="Phone" value={detail.applicant.phoneNumber} />
                  {detail.applicant.country && (
                    <DetailRow
                      label="Location"
                      value={[detail.applicant.city, detail.applicant.country].filter(Boolean).join(", ")}
                    />
                  )}
                  <DetailRow label="Submitted" value={formatDate(detail.submittedAt)} />
                </div>
              </div>

              {/* Category answers — rendered purely from field config */}
              <div>
                <h3 className="text-[#cca33a] text-sm font-semibold uppercase tracking-wide mb-3">
                  {detail.category.name} Application
                </h3>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 space-y-2">
                  {orderedFields.map((field) =>
                    field.type === "file" ? (
                      <div key={field.name} className="flex justify-between gap-4 text-sm py-1.5">
                        <span className="text-[#9F9FA9]">{field.label}</span>
                        {fileMap.has(field.name) ? (
                          <a
                            href={fileMap.get(field.name)!.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#cca33a] hover:underline flex items-center gap-1 text-right"
                          >
                            {fileMap.get(field.name)!.originalName}
                            <FiExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-white">—</span>
                        )}
                      </div>
                    ) : (
                      <DetailRow
                        key={field.name}
                        label={field.label}
                        value={formatAnswerValue(answerMap.get(field.name))}
                        multiline
                      />
                    )
                  )}
                </div>
              </div>

              {/* Status update */}
              <div>
                <h3 className="text-[#cca33a] text-sm font-semibold uppercase tracking-wide mb-3">
                  Update Status
                </h3>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {APPLICATION_STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPendingStatus(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          pendingStatus === s
                            ? "bg-[#cca33a] text-black border-[#cca33a]"
                            : "bg-[#111111] text-[#9F9FA9] border-[#2a2a2a] hover:border-[#cca33a]/50"
                        }`}
                      >
                        {statusLabel(s)}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Internal review note (optional, not visible to applicant)"
                    rows={3}
                    className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#cca33a] resize-none"
                  />
                  {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
                  <button
                    onClick={handleSaveStatus}
                    disabled={saving || pendingStatus === detail.status && reviewNote === (detail.reviewNote || "")}
                    className="w-full px-4 py-2.5 bg-[#cca33a] text-black text-sm font-semibold rounded-lg disabled:opacity-40"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={`flex ${multiline ? "flex-col gap-1" : "justify-between gap-4"} text-sm py-1.5`}>
      <span className="text-[#9F9FA9]">{label}</span>
      <span className={`text-white ${multiline ? "" : "text-right"}`}>{value}</span>
    </div>
  );
}