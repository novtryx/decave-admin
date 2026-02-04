

// const BASE_URL = process.env.API_URL!;

// type FetchOptions = {
//   method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
//   body?: any;
//   headers?: HeadersInit;
//   timeout?: number;
// };

// export async function fetcher<T>(
//   url: string,
//   options: FetchOptions = {}
// ): Promise<T> {
//   const { timeout = 30000, body, headers, ...rest } = options;

//   if (!BASE_URL) {
//     throw new Error("API_URL environment variable is not set");
//   }

//   const fullUrl = `${BASE_URL}${url}`;

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   const isFormData = body instanceof FormData;

//   try {
//     const res = await fetch(fullUrl, {
//       ...rest,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...headers,
//       },
//       body: isFormData ? body : body ? JSON.stringify(body) : undefined,
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     // Parse response body regardless of status
//     const data = await res.json().catch(() => ({}));

//     if (!res.ok) {
//       // Extract message from response body if available
//       const errorMessage = data?.message || `Request failed with status ${res.status}`;
//       throw new Error(errorMessage);
//     }

//     return data;
//   } catch (error: any) {
//     if (error.name === "AbortError") {
//       throw new Error(`Request timeout after ${timeout}ms`);
//     }
//     throw error;
//   }
// }


// lib/fetcher.ts - FIXED VERSION ✅

const BASE_URL = process.env.API_URL!;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: HeadersInit;
  timeout?: number;
};

// ✅ Add a response wrapper type
type FetchResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> { // ✅ Changed return type
  const { timeout = 30000, body, headers, ...rest } = options;

  if (!BASE_URL) {
    return { 
      success: false, 
      error: "API_URL environment variable is not set" 
    }; // ✅ Return error instead of throw
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

    // Parse response body regardless of status
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Extract message from response body if available
      const errorMessage = data?.message || `Request failed with status ${res.status}`;
      return { 
        success: false, 
        error: errorMessage 
      }; // ✅ Return error instead of throw
    }

    return { success: true, data }; // ✅ Wrap success response
  } catch (error: any) {
    if (error.name === "AbortError") {
      return { 
        success: false, 
        error: `Request timeout after ${timeout}ms` 
      }; // ✅ Return error instead of throw
    }
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred" 
    }; // ✅ Return error instead of throw
  }
}