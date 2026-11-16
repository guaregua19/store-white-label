import type { Product } from "@/lib/api/types";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";

interface Props {
  slug: string;
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
}

const gridClass = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

export function ProductGrid({ slug, products, page, totalPages, total }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-24 text-center">
        <h1 className="text-xl font-semibold">Aún no hay productos</h1>
        <p className="text-muted">Este catálogo no tiene productos disponibles por ahora.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-on-brand-soft">
          {total} {total === 1 ? "producto" : "productos"}
        </span>
      </div>
      <div className={gridClass}>
        {products.map((product) => (
          <ProductCard key={product.id} slug={slug} product={product} />
        ))}
      </div>
      <Pagination slug={slug} page={page} totalPages={totalPages} />
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-8 items-center">
        <div className="h-6 w-32 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className={gridClass}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-foreground/10">
            <div className="aspect-square animate-pulse bg-surface-muted" />
            <div className="flex flex-col gap-2 p-3 sm:p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
