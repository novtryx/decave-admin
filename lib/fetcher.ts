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

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`Request failed: ${res.status} - ${errorText}`);
//     }

//     return res.json();
//   } catch (error: any) {
//     if (error.name === "AbortError") {
//       throw new Error(`Request timeout after ${timeout}ms`);
//     }
//     throw error;
//   }
// }


const BASE_URL = process.env.API_URL!;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: HeadersInit;
  timeout?: number;
};

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, body, headers, ...rest } = options;

  if (!BASE_URL) {
    throw new Error("API_URL environment variable is not set");
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
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}