"use server";

import { protectedFetch } from "@/lib/protectedFetch";

interface SendFeedbackRequestResponse {
  success: boolean;
  message: string;
  totalRecipients: number;
  sentCount: number;
  failedBatches?: number[];
}

export async function sendEventFeedbackRequest(
  eventId: string,
  formLink: string,
  subject?: string,
  message?: string
): Promise<SendFeedbackRequestResponse | { error: string }> {
  const res = await protectedFetch<SendFeedbackRequestResponse>(
    `/events/${eventId}/send-feedback-request`,
    {
      method: "POST",
      body: {
        formLink,
        ...(subject?.trim() && { subject: subject.trim() }),
        ...(message?.trim() && { message: message.trim() }),
      },
    }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}