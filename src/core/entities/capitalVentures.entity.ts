import type { ArcapTraceable } from "./arcap.entity";

/**
 * Venture-capital fund, independent or corporate.
 *
 * Only `nombre` is guaranteed. Every other field is optional: the ARCAP load
 * records what the source actually published and leaves the rest out rather
 * than inventing it, so cards must tolerate missing fields.
 */
export interface CapitalVentures extends ArcapTraceable {
  nombre: string;
  sitioWeb?: string;
  contacto?: string;
  region?: string;
  tipoInversion?: string;
  foco?: string;
  etapa?: string;
  montoPromedio?: string;
  perfilBuscado?: string;
  convocatoria?: string;
  comentario?: string;
  algoritmo?: string;
  empresaRespaldo?: string;
  queBuscaParaSuNegocio?: string;
  programas?: string;
  portfolio?: string[];
}
