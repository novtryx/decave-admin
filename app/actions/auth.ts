// app/actions/login.ts
"use server";

import { deleteAccessToken, setAccessToken } from "@/lib/authCookies";
import { protectedFetch } from "@/lib/protectedFetch";
import { publicFetch } from "@/lib/publicFetch";

export async function loginAction(
  email: string,
  password: string
) {
  const res = await publicFetch<{ message: string, success: boolean  }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return res;
}


export async function verifyOTPAction(
  email: string,
  otp: string
) {
  const res = await publicFetch<{ token: string }>("/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
  });
  setAccessToken(res.token)
  return res;
}


export async function resendOTPAction(
  email: string,
  otp: string
) {
  const res = await publicFetch<{ message: string, success: boolean }>("/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
  return res;
}


export async function logoutOTPAction(
  
) {
  const res = await protectedFetch<{ message: string, success: boolean }>("/auth/logout", {
    method: "POST",
    
  });
  deleteAccessToken()
  return res;
}