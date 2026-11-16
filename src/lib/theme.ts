import type { CSSProperties } from "react";
import type { TenantBranding } from "@/lib/api/types";

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** El panel guarda los colores como texto libre: lo que no sea hex se descarta. Devuelve 6 dígitos. */
function hex(value: string | null, fallback: string): string {
  const color = value?.trim() ?? "";
  if (!HEX.test(color)) return fallback;
  return color.length === 4 ? color.replace(/[0-9a-f]/gi, "$&$&") : color;
}

/** Luminancia relativa (WCAG) de un hex de 6 dígitos. */
function luminance(color: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(color.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

function isDark(color: string): boolean {
  return contrast(color, "#ffffff") >= contrast(color, "#000000");
}

/** `preferred` si se distingue sobre `background`; si no, blanco o negro. */
function readableOn(background: string, preferred: string, minContrast: number): string {
  if (contrast(background, preferred) >= minContrast) return preferred;
  return isDark(background) ? "#ffffff" : "#000000";
}

// Un par elegido por el comercio (p. ej. blanco sobre naranja) se respeta aunque no llegue
// a AA; solo se corrige cuando es ilegible (blanco sobre blanco, gris sobre gris).
// Mismo umbral para el acento, que solo se usa en bordes y anillos de foco, nunca en texto.
const DISTINGUISHABLE_MIN = 2;
// Texto que la tienda deriva por su cuenta sí se exige legible (AA).
const DERIVED_TEXT_MIN = 4.5;

// Fondos de página de globals.css (claro / oscuro).
const PAGE_LIGHT = "#ffffff";
const PAGE_DARK = "#0a0a0a";

/**
 * Paleta del comercio como variables CSS (ver `@theme` en globals.css):
 * mainColor → superficie de marca, secondaryColor → texto sobre ella, thirdColor → acento suave.
 */
export function tenantTheme(tenant: TenantBranding) {
  const brand = hex(tenant.mainColor, "#000000");
  const soft = hex(tenant.thirdColor, "#cccccc");
  const button = hex(tenant.buttonColor, "#000000");
  const buttonText = readableOn(button, hex(tenant.buttonTextColor, "#ffffff"), DISTINGUISHABLE_MIN);
  const buttonHover = hex(tenant.buttonHoverColor, button);

  // El color de marca como borde sobre la página solo si se distingue de ese fondo.
  const accentOn = (page: string) => (contrast(brand, page) >= DISTINGUISHABLE_MIN ? brand : "var(--foreground)");

  return {
    style: {
      "--brand": brand,
      "--on-brand": readableOn(brand, hex(tenant.secondaryColor, "#ffffff"), DISTINGUISHABLE_MIN),
      "--brand-soft": soft,
      "--on-brand-soft": readableOn(soft, brand, DERIVED_TEXT_MIN),
      "--accent-light": accentOn(PAGE_LIGHT),
      "--accent-dark": accentOn(PAGE_DARK),
      "--button": button,
      "--button-text": buttonText,
      // Por defecto el hover es igual al botón: se mezcla con el texto para que haya respuesta visual.
      "--button-hover":
        buttonHover === button ? `color-mix(in srgb, ${button} 85%, ${buttonText})` : buttonHover,
    } as CSSProperties,
  };
}
