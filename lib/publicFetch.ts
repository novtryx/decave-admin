import { fetcher, fetcher2 } from "./fetcher";

export function publicFetch<T>(
  url: string,
  options?: Parameters<typeof fetcher>[1]
) {
  return fetcher<T>(url, options);
}

export function publicFetch2<T>(
  url: string,
  options?: Parameters<typeof fetcher2>[1]
) {
  return fetcher2<T>(url, options);
}