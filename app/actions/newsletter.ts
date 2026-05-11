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
  pagination: any;
}

export interface NewsletterEmailsData {
  emails: NewsletterEmail[];
  pagination: any;
}

export interface SendEmailPayload {
  subject: string;
  body: string;
  emails?: string[];   // optional when sendToAll is true
  sendToAll?: boolean;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  sentCount?: number;
}

export async function getNewsletterEmails({page = 1, limit= 10, }:  { page?: number; limit?: number }) : Promise<
  NewsletterEmailsData | { error: string }
> {

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });


  const res = await protectedFetch<GetEmailsApiResponse>(`/newsletter/emails?${params}`, {
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
  const pagination = apiBody?.pagination;

  console.log(
    `[getNewsletterEmails] ✅ Fetched ${emails.length} email(s) (page ${pagination.currentPage}/${pagination.totalPages})`,
  );

  return { emails, pagination };
}

export async function sendNewsletterEmail(
  payload: SendEmailPayload,
): Promise<SendEmailResponse | { error: string }> {
  console.log(
    "[sendNewsletterEmail] Sending to:",
    payload.emails?.length,
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
