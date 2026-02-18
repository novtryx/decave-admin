"use server";
import { protectedFetch } from "@/lib/protectedFetch";

export interface NewsletterEmail {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

interface GetEmailsApiResponse {
  success: boolean;
  data: NewsletterEmail[];
}

export interface NewsletterEmailsData {
  emails: NewsletterEmail[];
}

export interface SendEmailPayload {
  subject: string;
  body: string;
  emails: string[];
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  sentCount?: number;
}

export async function getNewsletterEmails(): Promise<
  NewsletterEmailsData | { error: string }
> {
  const res = await protectedFetch<GetEmailsApiResponse>("/newsletter/emails", {
    method: "GET",
  });

  console.log(
    "[getNewsletterEmails] protectedFetch result:",
    JSON.stringify(res, null, 2),
  );

  if (!res.success) {
    console.error("[getNewsletterEmails] Request failed:", res.error);
    return { error: res.error };
  }

  const apiBody = res.data;

  console.log(
    "[getNewsletterEmails] API body:",
    JSON.stringify(apiBody, null, 2),
  );

  if (!apiBody?.success) {
    console.error("[getNewsletterEmails] API returned success: false", apiBody);
    return { error: "Failed to fetch emails from API." };
  }

  const emails = apiBody.data ?? [];
  console.log(`[getNewsletterEmails] ✅ Fetched ${emails.length} email(s)`);

  return { emails };
}

export async function sendNewsletterEmail(
  payload: SendEmailPayload,
): Promise<SendEmailResponse | { error: string }> {
  console.log(
    "[sendNewsletterEmail] Sending to:",
    payload.emails.length,
    "recipients",
  );
  console.log("[sendNewsletterEmail] Subject:", payload.subject);

  const res = await protectedFetch<SendEmailResponse>(
    "/newsletter/send-email",
    {
      method: "POST",
      body: payload,
    },
  );

  console.log(
    "[sendNewsletterEmail] protectedFetch result:",
    JSON.stringify(res, null, 2),
  );

  if (!res.success) {
    console.error("[sendNewsletterEmail] Request failed:", res.error);
    return { error: res.error };
  }

  console.log("[sendNewsletterEmail] ✅ Email sent successfully");
  return res.data;
}
