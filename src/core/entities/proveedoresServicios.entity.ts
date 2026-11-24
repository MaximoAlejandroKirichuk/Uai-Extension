import type { ArcapTraceable } from "./arcap.entity";

/** Service provider to the ecosystem: law firms, recruiters, advisors. */
export interface ProveedorServicios extends ArcapTraceable {
  nombre: string;
  sitioWeb?: string;
  descripcion?: string;
  tipoServicio?: string;
  contacto?: string;
  region?: string;
  areaStartupsVc?: string;
  comoTrabajarConEllos?: string;
  programas?: string;
  materiales?: string;
  novedades?: string;
  eventos?: string;
}
