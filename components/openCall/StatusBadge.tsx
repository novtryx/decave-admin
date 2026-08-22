import { ApplicationStatus, statusLabel } from "@/types/openCallType";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  draft: "bg-[#2a2a2a] text-[#9F9FA9] border-[#3a3a3a]",
  submitted: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  under_review: "bg-[#cca33a]/10 text-[#cca33a] border-[#cca33a]/30",
  shortlisted: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  accepted: "bg-green-500/10 text-green-400 border-green-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}