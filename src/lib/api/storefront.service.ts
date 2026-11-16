import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { apiGet } from "./http";
import { settle, unwrap } from "./errors";
import type { Paginated, Product, FinancingType, PaymentMethod, Simulation, TenantBranding } from "./types";

const base = (slug: string) => `/storefront/${encodeURIComponent(slug)}`;

// Cada cuerpo cacheado devuelve un ApiResult y unwrap relanza el ApiError fuera de la caché.
// Las respuestas de error (404/403) se cachean con "seconds" para que un slug recién
// asignado o un tenant desbloqueado no queden ocultos durante horas.

async function cachedTenant(slug: string) {
  "use cache";
  cacheTag(`storefront:${slug}`);
  const result = await settle(apiGet<TenantBranding>(base(slug)));
  if (result.ok) cacheLife("hours");
  else cacheLife("seconds");
  return result;
}

export async function getTenant(slug: string): Promise<TenantBranding> {
  return unwrap(await cachedTenant(slug));
}

async function cachedProducts(slug: string, page: number, pageSize: number) {
  "use cache";
  cacheTag(`storefront:${slug}`, `storefront:${slug}:products`);
  const result = await settle(apiGet<Paginated<Product>>(`${base(slug)}/products`, { page, pageSize }));
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function listProducts(slug: string, page = 1, pageSize = 24): Promise<Paginated<Product>> {
  return unwrap(await cachedProducts(slug, page, pageSize));
}

async function cachedProduct(slug: string, id: number) {
  "use cache";
  cacheTag(`storefront:${slug}`, `storefront:${slug}:product:${id}`);
  const result = await settle(apiGet<Product>(`${base(slug)}/products/${id}`));
  if (result.ok) cacheLife("minutes");
  else cacheLife("seconds");
  return result;
}

export async function getProduct(slug: string, id: number): Promise<Product> {
  return unwrap(await cachedProduct(slug, id));
}

async function cachedFinancingTypes(slug: string) {
  "use cache";
  cacheTag(`storefront:${slug}`);
  const result = await settle(apiGet<{ data: FinancingType[] }>(`${base(slug)}/financing-types`));
  if (result.ok) cacheLife("hours");
  else cacheLife("seconds");
  return result;
}

export async function listFinancingTypes(slug: string): Promise<FinancingType[]> {
  return unwrap(await cachedFinancingTypes(slug)).data;
}

async function cachedPaymentMethods(slug: string) {
  "use cache";
  cacheTag(`storefront:${slug}`);
  const result = await settle(apiGet<{ data: PaymentMethod[] }>(`${base(slug)}/payment-methods`));
  if (result.ok) cacheLife("hours");
  else cacheLife("seconds");
  return result;
}

export async function listPaymentMethods(slug: string): Promise<PaymentMethod[]> {
  return unwrap(await cachedPaymentMethods(slug)).data;
}

// Sin caché: depende de la tasa del día y de la selección del usuario.
export function simulateFinancing(
  slug: string,
  productId: number,
  financingTypeId: number,
  paymentMethodId?: number,
): Promise<Simulation> {
  return apiGet(
    `${base(slug)}/products/${productId}/financing-types/${financingTypeId}/simulation`,
    { paymentMethodId },
  );
}
