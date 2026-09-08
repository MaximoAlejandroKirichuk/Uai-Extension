export interface ApiEventSource {
  id: string;
  nombre: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEvent {
  id: string;
  nombre: string;
  url?: string;
  descripcion?: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  ubicacion: string | null;
  categoria: string | null;
  modalidad: string | null;
  costo_entrada: string | null;
  fuente_id: string | null;
  fuente: ApiEventSource | null;
  url_detalles: string | null;
  finalizado: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventoEndeavor = ApiEvent;
