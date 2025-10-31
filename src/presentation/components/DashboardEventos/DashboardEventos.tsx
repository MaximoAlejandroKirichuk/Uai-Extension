import { useEffect, useState } from "react";
import {type Evento}  from '../../../core/entities/eventoEndeavor.entity.ts'
export const DashboardEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/events");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Evento[] = await response.json();
        setEventos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de los eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Eventos Endeavor</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-1">{evento.nombre}</h2>
            <p className="text-sm text-gray-600 mb-2">{evento.descripcion}</p>
            <p className="text-sm">
              <strong>Ubicación:</strong> {evento.ubicacion}
            </p>
            <p className="text-sm">
              <strong>Fecha:</strong>{" "}
              {new Date(evento.fecha_inicio).toLocaleDateString("es-AR")}
            </p>
            <p className="text-sm">
              <strong>Modalidad:</strong> {evento.modalidad}
            </p>
            <p className="text-sm">
              <strong>Categoría:</strong> {evento.categoria}
            </p>
            <p className="text-sm">
              <strong>Fuente:</strong>{" "}
              <a
                href={evento.fuente.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {evento.fuente.nombre}
              </a>
            </p>
            <a
              href={evento.url_detalles}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline font-medium"
            >
              Ver detalles →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};