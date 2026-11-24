import type { ArcapLinkStatus } from "../../../core/entities/arcap.entity";

const BARE_URL = /^https?:\/\/\S+$/;
const LEADING_URL = /^https?:\/\/\S+/;

const LINK_STATUS_REASON: Record<string, string> = {
  roto: "el dominio no responde",
  "403": "el sitio bloquea el acceso",
  sin_contenido: "el sitio no entrega contenido",
  error_ssl: "el certificado del sitio falla",
  captcha: "el sitio pide captcha",
  bloqueado_robots: "el sitio no permite el acceso automatico",
  no_encontrado: "la pagina no existe",
  sin_sitio: "no declara sitio web",
  sin_verificar: "sin verificar",
};

export const hasText = (value?: string): boolean =>
  typeof value === "string" && value.trim() !== "";

/**
 * Turns `sitioWeb` into a link only when it is a bare URL and the last check
 * reached it. Two cases are being guarded: the ARCAP records whose site answers
 * with a captcha, a 403 or nothing, and the records loaded before ARCAP, which
 * stored the URL with prose appended ("https://sf500.co / LinkedIn: SF500").
 */
export const resolveSiteLink = (
  url?: string,
  estado?: ArcapLinkStatus
): string | null => {
  const candidate = url?.trim();

  if (!candidate) {
    return null;
  }

  if (estado && estado !== "ok" && !estado.startsWith("redirect")) {
    return null;
  }

  if (BARE_URL.test(candidate)) {
    return candidate;
  }

  // Records loaded before ARCAP stored the address with prose appended
  // ("https://sf500.co / LinkedIn: SF500"). Link the address itself rather than
  // the whole string, which would produce a dead href.
  return candidate.match(LEADING_URL)?.[0] ?? null;
};

const SEGMENT_SEPARATOR = " · ";

/**
 * A field that cites several sources is stored as their values joined with a
 * middle dot, and those values often repeat or nest ("Argentina · Argentina;
 * Estados Unidos"). Drops a segment that another segment already contains.
 */
export const dedupeSegments = (value?: string): string | undefined => {
  if (!hasText(value)) {
    return value;
  }

  const segments = value!
    .split(SEGMENT_SEPARATOR)
    .map((segment) => segment.trim())
    .filter((segment) => segment !== "");

  if (segments.length < 2) {
    return value;
  }

  const kept = segments.filter(
    (segment, index) =>
      !segments.some(
        (other, otherIndex) =>
          otherIndex !== index &&
          other.includes(segment) &&
          (other.length > segment.length || otherIndex < index)
      )
  );

  return (kept.length > 0 ? kept : segments).join(SEGMENT_SEPARATOR);
};

/** Why a site is shown as plain text instead of a link. */
export const describeLinkStatus = (estado?: ArcapLinkStatus): string =>
  (estado && LINK_STATUS_REASON[estado]) ?? "no se pudo verificar";

/**
 * Firebase stores arrays as objects keyed by index and returns an array only
 * when those keys are contiguous from zero, so a list field can arrive either
 * way. `Object.values` covers both shapes.
 */
export const toStringList = (value: unknown): string[] => {
  const raw = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.values(value as Record<string, unknown>)
      : hasText(value as string)
        ? [value]
        : [];

  return raw.filter((item): item is string => hasText(item as string));
};
