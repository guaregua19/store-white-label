import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  slug: string;
  name: string;
  /** Logo para fondo oscuro (tema oscuro). */
  logoDarkUrl: string | null;
  /** Logo para fondo claro (tema claro). */
  logoLightUrl: string | null;
}

const LOGO_CLASS = "h-10 w-auto max-w-48 rounded object-contain";

export function StoreHeader({ slug, name, logoDarkUrl, logoLightUrl }: Props) {
  const sameLogo = logoDarkUrl === logoLightUrl;

  return (
    <header className="border-b-[3px] border-foreground/10 bg-surface text-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link
          href={`/catalog/${slug}`}
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          {logoDarkUrl || logoLightUrl ? (
            <>
              {logoLightUrl && (
                <Image
                  src={logoLightUrl}
                  alt={name}
                  width={120}
                  height={40}
                  unoptimized
                  className={sameLogo ? LOGO_CLASS : `${LOGO_CLASS} dark:hidden`}
                />
              )}
              {!sameLogo && logoDarkUrl && (
                <Image
                  src={logoDarkUrl}
                  alt={name}
                  width={120}
                  height={40}
                  unoptimized
                  className={`${LOGO_CLASS} hidden dark:block`}
                />
              )}
            </>
          ) : (
            <span className="text-lg font-semibold tracking-tight">{name}</span>
          )}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function StoreHeaderSkeleton() {
  return (
    <header className="border-b-[3px] border-foreground/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        <div className="h-8 w-32 animate-pulse rounded bg-surface-muted" />
      </div>
    </header>
  );
}
