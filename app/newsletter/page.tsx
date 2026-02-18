"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  getNewsletterEmails,
  sendNewsletterEmail,
  type NewsletterEmail,
} from "../actions/newsletter";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FaUsers } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import Spinner from "@/components/Spinner";
import { MdOutlineChevronRight } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";

const TOOLBAR_ACTIONS = [
  { cmd: "bold",                label: "B",       className: "font-bold" },
  { cmd: "italic",              label: "I",       className: "italic" },
  { cmd: "underline",           label: "U",       className: "underline" },
  { cmd: "insertUnorderedList", label: "• List",  className: "" },
  { cmd: "insertOrderedList",   label: "1. List", className: "" },
] as const;

const HEADING_OPTIONS = [
  { tag: "h1", label: "H1" },
  { tag: "h2", label: "H2" },
  { tag: "h3", label: "H3" },
  { tag: "p",  label: "¶"  },
];

export default function NewsletterPage() {
  const [emails, setEmails]          = useState<NewsletterEmail[]>([]);
  const [selected, setSelected]      = useState<Set<string>>(new Set());
  const [sendToAll, setSendToAll]    = useState(true);
  const [subject, setSubject]        = useState("");
  const [htmlBody, setHtmlBody]      = useState("");
  const [search, setSearch]          = useState("");
  const [toast, setToast]            = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loadingEmails, setLoading]  = useState(true);
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await getNewsletterEmails();
      if ("error" in res) showToast("error", res.error);
      else setEmails(res.emails ?? []);
      setLoading(false);
    })();
  }, []);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  }

  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    syncHtml();
  }

  function setHeading(tag: string) {
    document.execCommand("formatBlock", false, tag);
    editorRef.current?.focus();
    syncHtml();
  }

  function syncHtml() {
    setHtmlBody(editorRef.current?.innerHTML ?? "");
  }

  function insertLink() {
    const url = prompt("Enter URL:");
    if (url) execCmd("createLink", url);
  }

  function handleSend() {
    if (!subject.trim()) return showToast("error", "Subject is required.");
    if (!htmlBody.trim()) return showToast("error", "Email body cannot be empty.");

    const targetEmails = sendToAll
      ? emails.map((e) => e.email)
      : Array.from(selected);

    if (targetEmails.length === 0) return showToast("error", "No recipients selected.");

    startTransition(async () => {
      const res = await sendNewsletterEmail({ subject, body: htmlBody, emails: targetEmails });
      if ("error" in res) {
        showToast("error", res.error);
      } else {
        showToast("success", res.message ?? `Sent to ${targetEmails.length} recipient(s).`);
        setSubject("");
        setHtmlBody("");
        if (editorRef.current) editorRef.current.innerHTML = "";
        setSelected(new Set());
      }
    });
  }

  function toggleEmail(email: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  function toggleAll() {
    const visible = filteredEmails.map((e) => e.email);
    const allSelected = visible.every((e) => selected.has(e));
    setSelected((prev) => {
      const next = new Set(prev);
      allSelected
        ? visible.forEach((e) => next.delete(e))
        : visible.forEach((e) => next.add(e));
      return next;
    });
  }

  const filteredEmails = emails.filter((e) =>
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium shadow-2xl border backdrop-blur-sm transition-all
            ${toast.type === "success"
              ? "bg-[#0d2b1f]/90 border-[#2a6b45] text-emerald-400"
              : "bg-[#2b0d0d]/90 border-[#6b2a2a] text-red-400"
            }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-[#888] tracking-[0.15em] uppercase font-medium">
              Admin
            </span>
            <span className="text-[#444]">/</span>
            <span className="text-[11px] text-[#888] tracking-[0.15em] uppercase font-medium">
              Newsletter
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#cca33a] tracking-tight">Newsletter</h1>
          <p className="text-sm text-gray-400 mt-1">Compose and send emails to your subscribers.</p>
        </div>

        {/* Subscriber count badge */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-5 py-3">
          <div className="w-8 h-8 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
            <FaUsers />
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-none">{emails.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Subscribers</p>
          </div>
        </div>
      </div>

      {/* ── Compose Card ── */}
      <div className="bg-[#151515] border border-[#ccc] rounded-2xl overflow-hidden mb-5">

        {/* Card header */}
        <div className="px-6 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-md font-semibold text-white">Compose Email</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">

          {/* Subject + Recipients row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#a4a3a3] uppercase tracking-wider">Subject</label>
              <input
                className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none
                  focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/20
                  placeholder:text-[#444] transition-all"
                placeholder="Big Announcement 🚀"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Recipients */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#a4a3a3] uppercase tracking-wider">Recipients</label>
              <div className="grid grid-cols-2 gap-2 h-11.5">
                <button
                  onClick={() => setSendToAll(true)}
                  className={`rounded-xl text-sm font-medium border transition-all duration-150
                    ${sendToAll
                      ? "bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c]"
                      : "bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]"
                    }`}
                >
                  All ({emails.length})
                </button>
                <button
                  onClick={() => setSendToAll(false)}
                  className={`rounded-xl text-sm font-medium border transition-all duration-150
                    ${!sendToAll
                      ? "bg-[#c9a84c]/10 border-[#c9a84c]/50 text-[#c9a84c]"
                      : "bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]"
                    }`}
                >
                  Selected ({selected.size})
                </button>
              </div>
            </div>
          </div>

          {/* HTML Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#a4a3a3] uppercase tracking-wider">
              Body
              <span className="ml-2 text-[#444] tracking-normal">{" "} (HTML supported)</span>
            </label>

            <div className="border border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-[#c9a84c]/40 transition-colors">
              {/* Toolbar */}
              <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 bg-[#111] border-b border-[#1e1e1e]">
                {/* Heading buttons */}
                <div className="flex items-center gap-0.5 mr-1">
                  {HEADING_OPTIONS.map(({ tag, label }) => (
                    <button
                      key={tag}
                      onMouseDown={(e) => { e.preventDefault(); setHeading(tag); }}
                      className="text-[#555] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 text-xs font-bold px-2 py-1.5 rounded-lg transition-colors min-w-7"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="w-px h-4 bg-[#2a2a2a] mx-1 shrink-0" />

                {/* Format buttons */}
                <div className="flex items-center gap-0.5 mr-1">
                  {TOOLBAR_ACTIONS.map(({ cmd, label, className }) => (
                    <button
                      key={cmd}
                      onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
                      className={`text-[#555] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 text-xs px-2 py-1.5 rounded-lg transition-colors ${className}`}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
                    className="text-[#555] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 text-xs px-2 py-1.5 rounded-lg transition-colors"
                    title="Insert link"
                  >
                    🔗
                  </button>
                </div>

                <div className="w-px h-4 bg-[#2a2a2a] mx-1 shrink-0" />

                {/* Raw HTML */}
                <button
                  onClick={() => {
                    const raw = prompt("Paste raw HTML:");
                    if (raw !== null && editorRef.current) {
                      editorRef.current.innerHTML = raw;
                      syncHtml();
                    }
                  }}
                  className="ml-auto text-[#444] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 text-[11px] font-mono px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#c9a84c]/20"
                >
                  {"</>"}
                </button>
              </div>

              {/* Editable content */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncHtml}
                data-placeholder="Start writing your email…"
                className="min-h-50 p-4 text-sm text-[#ccc] leading-relaxed outline-none overflow-y-auto bg-[#0e0e0e]
                  [&[data-placeholder]:empty]:before:content-[attr(data-placeholder)]
                  [&[data-placeholder]:empty]:before:text-[#333]
                  [&_a]:text-[#c9a84c] [&_a]:underline
                  [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-2
                  [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2
                  [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-1
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2"
              />
            </div>

            {/* Raw HTML preview */}
            {htmlBody && (
              <details className="mt-1 bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 py-3 group">
                <summary className="text-xs text-[#444] cursor-pointer font-medium select-none hover:text-[#666] transition-colors list-none flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform inline-block"><MdOutlineChevronRight /></span>
                  Raw HTML output
                </summary>
                <pre className="mt-3 text-[11px] text-[#c9a84c]/60 whitespace-pre-wrap break-all font-mono leading-relaxed">
                  {htmlBody}
                </pre>
              </details>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold
              bg-[#c9a84c] 
              text-[#0e0e0e]
              shadow-[0_4px_24px_rgba(201,168,76,0.25)] hover:shadow-[0_4px_32px_rgba(201,168,76,0.35)]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#c9a84c] disabled:hover:shadow-none
              transition-all duration-150 cursor-pointer"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <div className="flex gap-2 bg-[#cca33a] text-[#ebe5e5] w-full justify-center text-lg items-center rounded-lg">
                <RiSendPlaneFill />
                Send{sendToAll ? ` to All (${emails.length})` : ` to Selected (${selected.size})`}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Subscribers Card ── */}
      <div className="bg-[#141414] mt-6 border border-[#222] rounded-2xl mb-20 overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div>
            <h2 className="text-md font-semibold text-white">Subscribers</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <IoSearch className="absolute top-4 left-4 text-[#2a2a2a]" />
              <input
                className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-xl p-3 pl-10 text-sm text-white outline-none
                   placeholder:text-[#444] transition-all w-56"
                placeholder="Search subscribers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Select all (only in selected mode) */}
            {!sendToAll && filteredEmails.length > 0 && (
              <button
                onClick={toggleAll}
                className="text-xs font-medium text-[#c9a84c] border border-[#c9a84c]/30 bg-[#c9a84c]/5 rounded-xl px-3.5 py-2 hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50 transition-all"
              >
                {filteredEmails.every((e) => selected.has(e.email)) ? "Deselect all" : "Select all"}
              </button>
            )}
          </div>
        </div>

        {/* Email rows */}
        <div className="divide-y divide-[#1a1a1a]">
          {loadingEmails ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[#444]">
              <span className="w-4 h-4 border-2 border-[#333] border-t-[#c9a84c] rounded-full animate-spin" />
              <span className="text-sm">Loading subscribers…</span>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-sm text-[#444]">No subscribers found</p>
            </div>
          ) : (
            filteredEmails.map((e, i) => (
              <div
                key={e._id}
                onClick={() => !sendToAll && toggleEmail(e.email)}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-100
                  ${!sendToAll ? "cursor-pointer" : "cursor-default"}
                  ${selected.has(e.email)
                    ? "bg-[#c9a84c]/5"
                    : "hover:bg-[#181818]"
                  }`}
              >
                {/* Checkbox */}
                {!sendToAll && (
                  <div
                    className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-all duration-150
                      ${selected.has(e.email)
                        ? "bg-[#c9a84c] border-[#c9a84c]"
                        : "border-[#333] bg-[#0e0e0e]"
                      }`}
                  >
                    {selected.has(e.email) && (
                      <svg className="w-2.5 h-2.5 text-[#0e0e0e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}

                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-[#666]">
                    {e.email[0].toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#ccc] font-medium truncate">{e.email}</p>
                  {e.createdAt && (
                    <p className="text-[11px] text-[#444] mt-0.5">
                      Joined {new Date(e.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* Row number */}
                <span className="text-[11px] text-[#333] font-mono shrink-0">#{i + 1}</span>

                {/* "Will receive" badge */}
                {sendToAll && (
                  <span className="text-[10px] font-semibold text-[#c9a84c] bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full px-2.5 py-1 tracking-wide shrink-0">
                    Will receive
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}   