import { Suspense } from "react";
import { listProducts } from "@/lib/api/storefront.service";
import { orNotFound } from "@/lib/api/errors";
import { ProductGrid, ProductGridSkeleton } from "@/components/catalog/ProductGrid";

export default function CatalogPage(props: PageProps<"/catalog/[tenantSlug]">) {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Catalog {...props} />
    </Suspense>
  );
}

async function Catalog({ params, searchParams }: PageProps<"/catalog/[tenantSlug]">) {
  const { tenantSlug } = await params;
  const { page } = await searchParams;
  const result = await orNotFound(listProducts(tenantSlug, Math.max(1, Number(page) || 1)));

  return (
    <ProductGrid
      slug={tenantSlug}
      products={result.data}
      page={result.page}
      totalPages={result.totalPages}
      total={result.total}
    />
  );
}
