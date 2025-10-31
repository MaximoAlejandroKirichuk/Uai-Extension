
type Fuente = {
  id: number;
  nombre: string;
  url: string;
};

export type Evento = {
  id: number;
  nombre: string;
  url: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  categoria: string;
  modalidad: string;
  url_detalles: string
  costo_entrada: string;
  finalizado: boolean;
  fuente: Fuente;
};