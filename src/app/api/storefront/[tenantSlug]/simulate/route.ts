import { simulateFinancing } from "@/lib/api/storefront.service";
import { ApiError } from "@/lib/api/errors";

export async function GET(req: Request, { params }: RouteContext<"/api/storefront/[tenantSlug]/simulate">) {
  const { tenantSlug } = await params;
  const q = new URL(req.url).searchParams;
  const productId = Number(q.get("productId"));
  const financingTypeId = Number(q.get("financingTypeId"));
  const paymentMethodId = q.get("paymentMethodId") ? Number(q.get("paymentMethodId")) : undefined;

  if (
    !Number.isInteger(productId) ||
    !Number.isInteger(financingTypeId) ||
    (paymentMethodId !== undefined && !Number.isInteger(paymentMethodId))
  ) {
    return Response.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    return Response.json(await simulateFinancing(tenantSlug, productId, financingTypeId, paymentMethodId));
  } catch (e) {
    if (e instanceof ApiError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}
