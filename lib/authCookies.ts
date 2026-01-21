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
  });
}

export async function getAccessToken(): Promise<string | null> {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value ?? null;
}

export async function deleteAccessToken() {
  (await cookies()).delete(ACCESS_TOKEN_KEY);
}
