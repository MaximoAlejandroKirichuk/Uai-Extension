import type { BaseEntity } from "./base.entity";

/** How literal a stored value is, relative to the source it cites. */
export type ArcapFidelity = "alta" | "media" | "baja";

/** Where a value came from, from most to least authoritative. */
export type ArcapConfidence =
  | "official"
  | "institutional"
  | "aggregator"
  | "manual_review_required";

/** One cited source for one field. A field can carry several. */
export interface ArcapSource {
  url: string;
  fecha: string;
  campoOrigen?: string;
  nivelConfianza?: ArcapConfidence;
  fidelidad?: ArcapFidelity;
}

/** Reachability of `sitioWeb` the last time the load checked it. */
export type ArcapLinkStatus =
  | "ok"
  | "redirect"
  | "redirect_301"
  | "redirect_302"
  | "roto"
  | "403"
  | "sin_contenido"
  | "error_ssl"
  | "captcha"
  | "bloqueado_robots"
  | "no_encontrado"
  | "sin_sitio"
  | "sin_verificar";

/**
 * Curation state. Nothing is `approved` yet: the whole ARCAP load entered as
 * `needs_review`. `reemplazado` marks a record superseded by a newer one, which
 * must stay out of the dashboards so the actor is not listed twice.
 */
export type ArcapReviewStatus = "needs_review" | "approved" | "reemplazado";

/**
 * A value held back from the card because it is not a literal transcription of
 * the source. Kept in the record so a curator can promote or discard it.
 */
export interface ArcapPendingValue {
  valor: string;
  fidelidad?: ArcapFidelity;
}

export interface ArcapSocialLinks {
  linkedin?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

/**
 * Fields the ARCAP load adds to every record it writes. All optional, because
 * records created through the internal forms carry none of them.
 */
export interface ArcapTraceable extends BaseEntity {
  actorId?: string;
  tipoActor?: string;
  vehiculo?: string;
  invierteEnStartups?: boolean;
  clasificacionAprobada?: boolean;
  estadoRevision?: ArcapReviewStatus;
  estadoLink?: ArcapLinkStatus;
  reemplazadoPor?: string;
  fuentes?: Record<string, ArcapSource[]>;
  pendienteCuraduria?: Record<string, ArcapPendingValue>;
  redes?: ArcapSocialLinks;
}
