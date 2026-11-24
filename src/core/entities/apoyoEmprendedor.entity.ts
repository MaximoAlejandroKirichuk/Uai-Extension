import type { ArcapTraceable } from "./arcap.entity";

/** Accelerator, incubator or company builder that supports founders. */
export interface ApoyoEmprendedor extends ArcapTraceable {
  nombre: string;
  sitioWeb?: string;
  tipoEntidad?: string;
  tipoApoyo?: string;
  aQuienApoya?: string;
  programas?: string;
  contacto?: string;
  region?: string;
  coberturaGeografica?: string;
  foco?: string;
  etapa?: string;
  convocatoria?: string;
  costoParticipacion?: string;
  montoPromedio?: string;
}
