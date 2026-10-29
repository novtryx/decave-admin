// lib/session.ts
// Edge-safe helpers (no next/headers) so they work in middleware AND server code.

export const ACCESS_TOKEN_KEY = "accessToken";
export const FULL_NAME_KEY = "userFullName";

// The only routes a "management" user may open.
export const MANAGEMENT_HOME = "/check-in";
export const MANAGEMENT_ALLOWED_PATHS = ["/check-in"];

// Backend endpoints a "management" user may call (check-in page needs
// the checkin + cocktails endpoints and the events list for the dropdown).
export const MANAGEMENT_ALLOWED_API_PREFIXES = ["/checkin", "/cocktails", "/events"];

export function decodeJwtPayload(token?: string | null): Record<string, any> | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getFullNameFromToken(token?: string | null): string | null {
  const p = decodeJwtPayload(token);
  return p?.fullName ?? p?.name ?? p?.user?.fullName ?? null;
}

export function isManagementName(fullName?: string | null): boolean {
  return !!fullName && fullName.toLowerCase().includes("management");
}

export function isManagementPath(pathname: string): boolean {
  return MANAGEMENT_ALLOWED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}