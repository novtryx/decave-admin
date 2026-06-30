"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getAllEvents } from "@/app/actions/event";
import { getEventTransactionHistory } from "@/app/actions/transaction";
import { sendEventFeedbackRequest } from "@/app/actions/feedback";
import { Event } from "@/types/eventsType";
import { searchEvents, formatDate } from "@/constants/functions";
import { FiSearch, FiSend, FiChevronDown } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdOutlineEventAvailable } from "react-icons/md";

export default function EventFeedbackPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [recipientLoading, setRecipientLoading] = useState(false);

  const [formLink, setFormLink] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formLinkError, setFormLinkError] = useState<string | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      setEventsLoading(true);
      const res = await getAllEvents(1, 100);
      if (!("error" in res)) {
        setEvents(res.data);
      }
      setEventsLoading(false);
    })();
  }, []);

  // Preview how many people will actually receive this, before sending
  useEffect(() => {
    if (!selectedEvent) return;

    let cancelled = false;

    const fetchRecipientCount = async () => {
      setRecipientLoading(true);
      setRecipientCount(null);

      const res = await getEventTransactionHistory(selectedEvent._id, 1, 1);
      if (!cancelled && !("error" in res)) {
        setRecipientCount(res.stats.totalCompleted);
      }
      if (!cancelled) setRecipientLoading(false);
    };

    fetchRecipientCount();

    return () => {
      cancelled = true;
    };
  }, [selectedEvent]);

  const filteredEvents = useMemo(
    () => searchEvents(events, pickerSearch),
    [events, pickerSearch]
  );

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  function validateFormLink(value: string): boolean {
    if (!value.trim()) {
      setFormLinkError("A form link is required");
      return false;
    }
    try {
      const url = new URL(value.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        setFormLinkError("Link must start with http:// or https://");
        return false;
      }
    } catch {
      setFormLinkError("Enter a valid URL");
      return false;
    }
    setFormLinkError(null);
    return true;
  }

  const handleSend = async () => {
    if (!selectedEvent) {
      showToast("error", "Select an event first");
      return;
    }
    if (!validateFormLink(formLink)) return;

    setIsSending(true);
    const res = await sendEventFeedbackRequest(
      selectedEvent._id,
      formLink.trim(),
      subject,
      message
    );
    setIsSending(false);

    if ("error" in res) {
      showToast("error", res.error);
      return;
    }

    showToast(
      "success",
      `Sent to ${res.sentCount} of ${res.totalRecipients} attendee(s)`
    );
    setFormLink("");
    setSubject("");
    setMessage("");
  };

  const canSend = !!selectedEvent && formLink.trim().length > 0 && !isSending;

  return (
    <DashboardLayout>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium shadow-2xl border backdrop-blur-sm transition-all
            ${
              toast.type === "success"
                ? "bg-[#0d2b1f]/90 border-[#2a6b45] text-emerald-400"
                : "bg-[#2b0d0d]/90 border-[#6b2a2a] text-red-400"
            }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            ${toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
          >
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="bg-[#382802] text-[#cca33a] text-2xl rounded-xl p-3 flex items-center justify-center">
          <HiOutlineSparkles />
        </div>
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-1">
            Send Review Request
          </h3>
          <p className="text-[#B3B3B3]">
            Email a feedback form link to everyone who bought a ticket for an event
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-[#151515] border border-[#27272A] rounded-2xl p-6 space-y-6">
          {/* Event picker */}
          <div>
            <label className="block text-sm font-medium text-[#F4F4F5] mb-2">
              Event <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPickerOpen((open) => !open)}
                className="w-full flex items-center justify-between gap-3 bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-3 text-left hover:border-[#cca33a]/50 transition-colors"
              >
                {selectedEvent ? (
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#0c0c0c] shrink-0">
                      {selectedEvent.eventDetails.eventBanner && (
                        <Image
                          src={selectedEvent.eventDetails.eventBanner}
                          alt={selectedEvent.eventDetails.eventTitle}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[#F4F4F5] font-medium truncate">
                        {selectedEvent.eventDetails.eventTitle}
                      </span>
                      <span className="block text-[#9F9FA9] text-xs truncate">
                        {selectedEvent.eventDetails.venue} •{" "}
                        {formatDate(selectedEvent.eventDetails.startDate)}
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-[#6F6F6F]">
                    <MdOutlineEventAvailable className="text-lg" />
                    Select an event
                  </span>
                )}
                <FiChevronDown
                  className={`text-[#6F6F6F] shrink-0 transition-transform ${isPickerOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsPickerOpen(false)}
                  />
                  <div className="absolute z-20 mt-2 w-full bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2 border-b border-[#27272A]">
                      <div className="relative">
                        <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-[#6F6F6F]" />
                        <input
                          autoFocus
                          type="text"
                          value={pickerSearch}
                          onChange={(e) => setPickerSearch(e.target.value)}
                          placeholder="Search events..."
                          className="w-full bg-[#0F0F0F] border border-[#27272A] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F9F7F4] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#CCA33A]"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {eventsLoading ? (
                        <div className="p-6 text-center text-sm text-[#6F6F6F]">
                          Loading events...
                        </div>
                      ) : filteredEvents.length === 0 ? (
                        <div className="p-6 text-center text-sm text-[#6F6F6F]">
                          No events found
                        </div>
                      ) : (
                        filteredEvents.map((event) => (
                          <button
                            key={event._id}
                            type="button"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsPickerOpen(false);
                              setPickerSearch("");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#27272A] transition-colors text-left"
                          >
                            <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#0c0c0c] shrink-0">
                              {event.eventDetails.eventBanner && (
                                <Image
                                  src={event.eventDetails.eventBanner}
                                  alt={event.eventDetails.eventTitle}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[#F4F4F5] text-sm font-medium truncate">
                                {event.eventDetails.eventTitle}
                              </span>
                              <span className="block text-[#9F9FA9] text-xs truncate">
                                {event.eventDetails.venue} •{" "}
                                {formatDate(event.eventDetails.startDate)}
                              </span>
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Recipient preview */}
            {selectedEvent && (
              <p className="mt-2 text-xs text-[#9F9FA9]">
                {recipientLoading ? (
                  "Checking ticket buyers..."
                ) : recipientCount === null ? (
                  ""
                ) : recipientCount === 0 ? (
                  <span className="text-amber-500">
                    No completed ticket buyers for this event yet — sending will fail
                  </span>
                ) : (
                  <>
                    Will be sent to{" "}
                    <span className="text-[#cca33a] font-medium">
                      {recipientCount} completed ticket buyer{recipientCount !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Form link */}
          <div>
            <label className="block text-sm font-medium text-[#F4F4F5] mb-2">
              Feedback Form Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formLink}
              onChange={(e) => {
                setFormLink(e.target.value);
                if (formLinkError) setFormLinkError(null);
              }}
              onBlur={() => formLink && validateFormLink(formLink)}
              placeholder="https://forms.gle/your-form-id"
              className={`w-full bg-[#18181B] border rounded-xl px-4 py-3 text-sm text-[#F9F7F4] placeholder:text-[#6F6F6F] focus:outline-none transition-colors ${
                formLinkError ? "border-red-500" : "border-[#27272A] focus:border-[#CCA33A]"
              }`}
            />
            {formLinkError ? (
              <p className="mt-1.5 text-xs text-red-500">{formLinkError}</p>
            ) : (
              <p className="mt-1.5 text-xs text-[#6F6F6F]">
                Paste your Google Form link (or any survey link)
              </p>
            )}
          </div>

          {/* Subject (optional) */}
          <div>
            <label className="block text-sm font-medium text-[#F4F4F5] mb-2">
              Subject <span className="text-[#6F6F6F] text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                selectedEvent
                  ? `How was ${selectedEvent.eventDetails.eventTitle}? We'd love your feedback`
                  : "How was the event? We'd love your feedback"
              }
              className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-[#F9F7F4] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#CCA33A] transition-colors"
            />
          </div>

          {/* Message (optional) */}
          <div>
            <label className="block text-sm font-medium text-[#F4F4F5] mb-2">
              Message <span className="text-[#6F6F6F] text-xs">(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Thank you for being part of the event! We'd love to hear about your experience — it only takes a couple of minutes."
              className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-[#F9F7F4] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#CCA33A] transition-colors resize-none"
            />
            <p className="mt-1.5 text-xs text-[#6F6F6F]">
              Leave blank to use the default thank-you message
            </p>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#cca33a] hover:bg-[#b8923a] px-4 py-3 font-semibold text-[#111827] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#111827]"></div>
                Sending...
              </>
            ) : (
              <>
                <FiSend />
                Send Review Request
              </>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}