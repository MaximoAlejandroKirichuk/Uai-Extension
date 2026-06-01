import type { BaseEntity } from "./base.entity";

export interface CapitalVentures extends BaseEntity {
  nombre: string;
  sitioWeb: string;
  contacto?: string;
  region: string;
  tipoInversion: string;
  foco: string;
  etapa: string;
  montoPromedio: string;
  perfilBuscado: string;
  convocatoria: string;
  comentario: string;
  algoritmo: string;
}
  