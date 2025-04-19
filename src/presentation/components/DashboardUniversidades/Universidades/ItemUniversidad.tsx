import { Universidad } from "../../../../core/entities/universidad.entity";

interface Props {
  uni: Universidad;
  id: string; // Necesitamos el id del registro en Firebase
  onDelete: (id: string) => void;
}

export const ItemUniversidad = ({ uni, id, onDelete }: Props) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{uni.nombre}</h2>
        <div className="flex gap-1">
          <button className="transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={() => onDelete(id)} title="Eliminar">
            🗑️
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-2">{uni.descripcion}</p>

      {uni.contacto && (
        <p className="text-sm mb-2">
          <span className="font-bold">Contacto:</span> {uni.contacto}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {uni.redes?.linkedin && (
          <a
            href={uni.redes.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            LinkedIn
          </a>
        )}
        {uni.redes?.instagram && (
          <a
            href={uni.redes.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 underline text-sm"
          >
            Instagram
          </a>
        )}
        {uni.redes?.x && (
          <a
            href={uni.redes.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline text-sm"
          >
            X
          </a>
        )}
      </div>
    </div>
  );
};
