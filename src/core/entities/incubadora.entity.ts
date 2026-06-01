export interface Incubadora {
  id?: string;
  nroInscripcion: string;
  cuit: string;
  nombre: string;
  provincia: string;
  localidad: string;
  direccion: string;
  numero?: string;
  piso?: string;
  departamento?: string;
  codigoPostal?: string;
  nombreResponsable: string;
  emailResponsable: string;
  telefonoResponsable: string;
}
