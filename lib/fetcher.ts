const BASE_URL = process.env.API_URL!;
const BASE_URL2 = process.env.API_URL2!;


type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: HeadersInit;
  timeout?: number;
};

type FetchResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  // const { timeout = 30000, body, headers, ...rest } = options;
  const { timeout = 60000, body, headers, ...rest } = options; // 60 seconds

  if (!BASE_URL) {
    return {
      success: false,
      error: "API_URL environment variable is not set",
    }; 
  }

  const fullUrl = `${BASE_URL}${url}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const isFormData = body instanceof FormData;

  try {
    const res = await fetch(fullUrl, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        data?.message || `Request failed with status ${res.status}`;
      return {
        success: false,
        error: errorMessage,
      }; 
    }

    return { success: true, data };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: `Request timeout after ${timeout}ms`,
      }; 
    }
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}


export async function fetcher2<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  // const { timeout = 30000, body, headers, ...rest } = options;
  const { timeout = 60000, body, headers, ...rest } = options; // 60 seconds

  if (!BASE_URL2) {
    return {
      success: false,
      error: "API_URL environment variable is not set",
    }; 
  }

  const fullUrl = `${BASE_URL2}${url}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const isFormData = body instanceof FormData;

  try {
    const res = await fetch(fullUrl, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        data?.message || `Request failed with status ${res.status}`;
      return {
        success: false,
        error: errorMessage,
      }; 
    }

    return { success: true, data };
  } catch (error: any) {
    if (error.name === "AbortError") {
      return {
        success: false,
        error: `Request timeout after ${timeout}ms`,
      }; 
    }
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}