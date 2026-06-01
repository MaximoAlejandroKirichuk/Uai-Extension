import type { BaseEntity } from "./base.entity";

export interface OrganismoEstado extends BaseEntity {
  nombre: string;
  area: string;
  descripcion: string;
  programas: string;
  tiposFinanciamiento: string;
  fechasRelevantes: string;
  requisitosAcceso: string;
  contacto: string;
  enlaces: string;
  estadoSeguimiento: string;
  beneficiarios: string;
  alianzas: string;
}
