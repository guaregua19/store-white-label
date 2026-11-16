import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";

export function primaryImage(product: Product) {
  return product.images.find((image) => image.isPrimary) ?? product.images[0];
}

export function ProductCard({ slug, product }: { slug: string; product: Product }) {
  const image = primaryImage(product);

  return (
    <Link
      href={`/catalog/${slug}/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-surface text-foreground outline-none transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
    >
      <div className="relative flex aspect-square items-center justify-center bg-surface-muted">
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-10 text-muted"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="m21 15-4.5-4.5L7 20" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        {product.brand && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted">{product.brand.name}</span>
        )}
        <h2 className="line-clamp-2 text-sm font-medium leading-snug sm:text-base">{product.name}</h2>
        <span className="text-xs text-muted sm:text-sm">
          {product.ram} · {product.color}
        </span>
        <span className="mt-auto pt-2 text-base font-semibold sm:text-lg">{formatMoney(product.price, "USD")}</span>
      </div>
    </Link>
  );
}
