import { Suspense } from "react";
import { getTenant } from "@/lib/api/storefront.service";
import { isNotFoundOrBlocked } from "@/lib/api/errors";
import { tenantTheme } from "@/lib/theme";
import { StoreHeader, StoreHeaderSkeleton } from "@/components/catalog/StoreHeader";

export default function TenantLayout({ children, params }: LayoutProps<"/catalog/[tenantSlug]">) {
  return (
    <Suspense fallback={<StoreHeaderSkeleton />}>
      <TenantShell params={params}>{children}</TenantShell>
    </Suspense>
  );
}

async function TenantShell({ params, children }: LayoutProps<"/catalog/[tenantSlug]">) {
  const { tenantSlug } = await params;

  // notFound() aquí lo atraparía el not-found del segmento padre, no el de esta tienda:
  // se deja que la página (que recibe el mismo 404/403 del backend) lo dispare.
  const tenant = await getTenant(tenantSlug).catch((e) => {
    if (isNotFoundOrBlocked(e)) return null;
    throw e;
  });
  if (!tenant) return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>;

  const { style } = tenantTheme(tenant);
  // El header tiene fondo fijo según el tema (no depende de la marca). El logo principal es el del
  // panel (fondo oscuro); logoLightUrl es su variante para fondos claros. Si falta una, se usa la otra.
  const logoDarkUrl = tenant.logoUrl || tenant.logoLightUrl || null;
  const logoLightUrl = tenant.logoLightUrl || tenant.logoUrl || null;

  return (
    <div
      style={style}
      className="flex flex-1 flex-col [--accent:var(--accent-light)] dark:[--accent:var(--accent-dark)]"
    >
      <StoreHeader slug={tenantSlug} name={tenant.name} logoDarkUrl={logoDarkUrl} logoLightUrl={logoLightUrl} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
