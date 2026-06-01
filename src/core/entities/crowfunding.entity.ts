import type { BaseEntity } from "./base.entity";

export interface Crowfunding extends BaseEntity {
  nombrePlataforma: string;
  descripcion: string;
  contacto?: string;
  facilidadUso: string;
  comisiones: string;
  algoritmo: string;
}
  