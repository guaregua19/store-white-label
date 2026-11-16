import Link from "next/link";

interface Props {
  slug: string;
  page: number;
  totalPages: number;
}

export function Pagination({ slug, page, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const href = (target: number) => `/catalog/${slug}?page=${target}`;
  // El borde (mezcla del color del texto) separa el botón del fondo cuando ambos coinciden,
  // p. ej. el botón negro por defecto en modo oscuro.
  const boxClass = "rounded-lg border px-4 py-2 text-sm font-medium";
  const linkClass = `${boxClass} border-button-text/25 bg-button text-button-text outline-none transition-colors hover:bg-button-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background`;
  const placeholderClass = `${boxClass} invisible`;

  return (
    <nav className="flex items-center justify-center gap-4" aria-label="Paginación">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass}>
          Anterior
        </Link>
      ) : (
        <span className={placeholderClass}>Anterior</span>
      )}
      <span className="text-sm tabular-nums text-muted">
        Página {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkClass}>
          Siguiente
        </Link>
      ) : (
        <span className={placeholderClass}>Siguiente</span>
      )}
    </nav>
  );
}
