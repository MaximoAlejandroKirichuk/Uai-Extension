export interface Universidad {
    id?: string; // este campo lo uso para eliminar
    nombre: string;
    descripcion: string;
    contacto?: string;
    redes?: {
      linkedin?: string;
      instagram?: string;
      x?: string;
    };
  }
  