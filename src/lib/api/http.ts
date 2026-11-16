import "server-only";
import { ApiError } from "./errors";

const BASE_URL = process.env.QUOTA_API_URL!;
const STOREFRONT_KEY = process.env.QUOTA_STOREFRONT_KEY!;

type Query = Record<string, string | number | undefined>;

export async function apiGet<T>(path: string, query?: Query): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    headers: { "X-Storefront-Key": STOREFRONT_KEY, Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.message ?? body?.error ?? res.statusText, body?.code);
  }
  return res.json() as Promise<T>;
}
