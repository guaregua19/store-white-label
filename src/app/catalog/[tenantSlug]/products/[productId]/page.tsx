import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, listFinancingTypes, listPaymentMethods } from "@/lib/api/storefront.service";
import { orNotFound } from "@/lib/api/errors";
import { formatMoney } from "@/lib/format";
import { primaryImage } from "@/components/catalog/ProductCard";
import { FinancingSimulator } from "@/components/catalog/FinancingSimulator";

export default function ProductPage(props: PageProps<"/catalog/[tenantSlug]/products/[productId]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface-muted" />}>
      <ProductDetail {...props} />
    </Suspense>
  );
}

async function ProductDetail({ params }: PageProps<"/catalog/[tenantSlug]/products/[productId]">) {
  const { tenantSlug, productId } = await params;
  const id = Number(productId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [product, financingTypes, paymentMethods] = await orNotFound(
    Promise.all([getProduct(tenantSlug, id), listFinancingTypes(tenantSlug), listPaymentMethods(tenantSlug)]),
  );
  const cover = primaryImage(product);
  const gallery = product.images.filter((image) => image.id !== cover?.id);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-muted">
          {cover && <Image src={cover.url} alt={product.name} fill unoptimized priority className="object-contain p-6" />}
        </div>
        {gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((image) => (
              <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted">
                <Image src={image.url} alt={product.name} fill unoptimized className="object-contain p-2" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          {product.brand && <span className="text-sm uppercase text-muted">{product.brand.name}</span>}
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <span className="text-2xl font-semibold">{formatMoney(product.price, "USD")}</span>
          <span className="text-sm text-muted">{product.stock > 0 ? "Disponible" : "Sin stock"}</span>
        </div>

        {product.description && <p className="whitespace-pre-line text-muted">{product.description}</p>}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Spec label="RAM" value={product.ram} />
          <Spec label="Color" value={product.color} />
          {product.modelNumber && <Spec label="Modelo" value={product.modelNumber} />}
          {product.category && <Spec label="Categoría" value={product.category.name} />}
          {product.features.map((feature) => (
            <Spec key={feature.title} label={feature.title} value={feature.description} />
          ))}
        </dl>

        <FinancingSimulator
          slug={tenantSlug}
          productId={product.id}
          financingTypes={financingTypes}
          paymentMethods={paymentMethods}
        />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
