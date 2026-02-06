import { fetcher } from "./fetcher";
import { getAccessToken } from "./authCookies";

type ProtectedFetchError = {
  success: false;
  error: string;
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

  return fetcher<T>(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}