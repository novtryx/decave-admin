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
  const { timeout = 30000, ...fetchOptions } = options;

  // Validate BASE_URL
  if (!BASE_URL) {
    throw new Error("API_URL environment variable is not set");
  }

  const fullUrl = `${BASE_URL}${url}`;
  console.log('📡 Fetching:', fullUrl); // Debug log

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(fullUrl, {
      method: fetchOptions.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error message');
      throw new Error(`Request failed: ${res.status} - ${errorText}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      // Timeout error
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms - Server not responding`);
      }
      
      // Connection error
      if (error.message.includes('fetch failed')) {
        throw new Error(`Cannot connect to API at ${BASE_URL} - Is the server running?`);
      }
    }
    
    throw error;
  }
}