import { fetcher, fetcher2 } from "./fetcher";
import { getAccessToken, getFullName } from "./authCookies";
import {
  MANAGEMENT_ALLOWED_API_PREFIXES,
  getFullNameFromToken,
  isManagementName,
} from "./session";

// Server-side guard: management accounts can only call check-in related endpoints.
async function managementBlocked(token: string, url: string) {
  const name = getFullNameFromToken(token) ?? (await getFullName());
  if (!isManagementName(name)) return false;
  const allowed = MANAGEMENT_ALLOWED_API_PREFIXES.some((p) => url.startsWith(p));
  // /events is read-only for management
  return !allowed;
}

type ProtectedFetchError = {
  success: false;
  error: string;
  message?: string
};

export async function protectedFetch<T>(
  url: string,
  options?: Parameters<typeof fetcher>[1]
): Promise<{ success: true; data: T } | ProtectedFetchError> {
  const token = await getAccessToken();

  if (!token) {
    return {
      success: false as const,
      error: "Not authenticated. Please log in.",
    };
  }

  if (await managementBlocked(token, url)) {
    return {
      success: false as const,
      error: "You do not have permission to access this resource.",
    };
  }

  return fetcher<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function protectedFetch2<T>(
  url: string,
  options?: Parameters<typeof fetcher>[1]
): Promise<{ success: true; data: T } | ProtectedFetchError> {
  const token = await getAccessToken();

  if (!token) {
    return {
      success: false as const,
      error: "Not authenticated. Please log in.",
    };
  }

  if (await managementBlocked(token, url)) {
    return {
      success: false as const,
      error: "You do not have permission to access this resource.",
    };
  }

  return fetcher2<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}