import type { BaseEntity } from "./base.entity";

export interface Plataforma extends BaseEntity {
  nombrePlataforma: string;
  descripcion: string;
  contacto?: string;
  tipoPlataforma: string;
  industria: string;
  etapaCubre: string;
  montoPromedio: string;
  requisitosAcceso: string;
  costoComision: string;
  algoritmo: string;
}
  