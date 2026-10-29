// // app/actions/login.ts
// "use server";

// import { deleteAccessToken, setAccessToken } from "@/lib/authCookies";
// import { protectedFetch } from "@/lib/protectedFetch";
// import { publicFetch } from "@/lib/publicFetch";

// export async function loginAction(
//   email: string,
//   password: string
// ) {
//   const res = await publicFetch<{ message: string, success: boolean  }>("/auth/login", {
//     method: "POST",
//     body: { email, password },
//   });

//   return res;
// }

// export async function verifyOTPAction(
//   email: string,
//   otp: string  
// ) {
//   const res = await publicFetch<{ token: string }>("/auth/verify-otp", {
//     method: "POST",
//     body: { email, otp },
//   });
//   await setAccessToken(res.token)
//   return res;
// }

// export async function resendOTPAction(
//   email: string,
//   otp: string
// ) {
//   const res = await publicFetch<{ message: string, success: boolean }>("/auth/resend-otp", {
//     method: "POST",
//     body: { email },
//   });
//   return res;
// }


// export async function logoutAction(
  
// ) {
//   const res = await protectedFetch<{ message: string, success: boolean }>("/auth/logout", {
//     method: "POST",
    
//   });
//   deleteAccessToken()
//   return res;
// }


// app/actions/login.ts
"use server";

import { deleteAccessToken, setAccessToken, setFullName, getFullName, getAccessToken } from "@/lib/authCookies";
import { getFullNameFromToken, isManagementName } from "@/lib/session";
import { protectedFetch } from "@/lib/protectedFetch";
import { publicFetch } from "@/lib/publicFetch";

export async function loginAction(
  email: string,
  password: string
): Promise<{ message: string; success: boolean } | { error: string }> { // ✅ Add return type
  const res = await publicFetch<{ message: string, success: boolean }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  // Handle both success and error cases
  if (!res.success) {
    return { error: res.error };
  }

  return res.data; // { message: "OTP sent to your email", success: true }
}

export async function verifyOTPAction(
  email: string,
  otp: string  
): Promise<{ token: string; isManagement?: boolean } | { error: string }> { // ✅ Add return type
  const res = await publicFetch<{ token: string; data?: { fullName?: string } }>("/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
  });
  
  if (!res.success) {
    return { error: res.error };
  }
  
  await setAccessToken(res.data.token);

  // Work out who logged in (response body first, then the token itself)
  const fullName =
    res.data.data?.fullName ?? getFullNameFromToken(res.data.token) ?? "";
  if (fullName) await setFullName(fullName);

  return { token: res.data.token, isManagement: isManagementName(fullName) };
}

export async function resendOTPAction(
  email: string
): Promise<{ message: string; success: boolean } | { error: string }> { // ✅ Add return type
  const res = await publicFetch<{ message: string, success: boolean }>("/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
  
  if (!res.success) {
    return { error: res.error };
  }
  
  return res.data;
}

export async function logoutAction(): Promise<{ message: string; success: boolean } | { error: string }> { // ✅ Add return type
  const res = await protectedFetch<{ message: string, success: boolean }>("/auth/logout", {
    method: "POST",
  });
  
  if (!res.success) {
    return { error: res.error };
  }
  
  deleteAccessToken();
  return res.data;
}

// Used by the client (sidebar/header) to know who is logged in.
export async function getSessionUser(): Promise<{ fullName: string | null; isManagement: boolean }> {
  const token = await getAccessToken();
  const fullName = getFullNameFromToken(token) ?? (await getFullName());
  return { fullName, isManagement: isManagementName(fullName) };
}