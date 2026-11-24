import type { ArcapTraceable } from "./arcap.entity";

/**
 * Fund that does not invest in startups: private equity, search funds, family
 * offices and buy-and-hold vehicles. Kept apart from `capitalVentures` so the
 * venture-capital radar stays about venture capital.
 */
export interface FondoPrivateEquity extends ArcapTraceable {
  nombre: string;
  sitioWeb?: string;
  contacto?: string;
  region?: string;
  tipoInversion?: string;
  foco?: string;
  etapa?: string;
  comentario?: string;
  algoritmo?: string;
  empresaRespaldo?: string;
  portfolio?: string[];
}
