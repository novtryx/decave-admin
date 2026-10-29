"use server"
import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "accessToken";

export async function setAccessToken(token: string) {
  (await cookies()).set({
    name: ACCESS_TOKEN_KEY,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 4, // 4 days
  });
}

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value ?? null;
}

export async function deleteAccessToken() {
  (await cookies()).delete(ACCESS_TOKEN_KEY);
  (await cookies()).delete("userFullName");
}

export async function setFullName(fullName: string) {
  (await cookies()).set({
    name: "userFullName",
    value: encodeURIComponent(fullName),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 4,
  });
}

export async function getFullName(): Promise<string | null> {
  const v = (await cookies()).get("userFullName")?.value;
  return v ? decodeURIComponent(v) : null;
}