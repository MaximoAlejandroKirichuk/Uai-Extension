import type { BaseEntity } from "./base.entity";

export interface Universidad extends BaseEntity {
  nombre: string;
  descripcion: string;
  contacto?: string;
  redes?: {
    linkedin?: string;
    instagram?: string;
    x?: string;
  };
}
  