import "server-only";
import { apiGet } from "./http";
import type { Paginated, Product, FinancingType, PaymentMethod, Simulation, TenantBranding } from "./types";

const base = (slug: string) => `/storefront/${encodeURIComponent(slug)}`;

export function getTenant(slug: string): Promise<TenantBranding> {
  return apiGet<TenantBranding>(base(slug));
}

export function listProducts(slug: string, page = 1, pageSize = 24): Promise<Paginated<Product>> {
  return apiGet<Paginated<Product>>(`${base(slug)}/products`, { page, pageSize });
}

export function getProduct(slug: string, id: number): Promise<Product> {
  return apiGet<Product>(`${base(slug)}/products/${id}`);
}

export async function listFinancingTypes(slug: string): Promise<FinancingType[]> {
  return (await apiGet<{ data: FinancingType[] }>(`${base(slug)}/financing-types`)).data;
}

export async function listPaymentMethods(slug: string): Promise<PaymentMethod[]> {
  return (await apiGet<{ data: PaymentMethod[] }>(`${base(slug)}/payment-methods`)).data;
}

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
