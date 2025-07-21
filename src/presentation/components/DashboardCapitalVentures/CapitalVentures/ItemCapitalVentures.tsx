import { CapitalVentures } from "../../../../core/entities/capitalVentures.entity";

interface Props {
  venture: CapitalVentures;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemCapitalVenture = ({ venture, id, onDelete }: Props) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-blue-700">
          {venture.nombre}
        </h2>
        <button
          className="transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      <p className="text-gray-700 mb-2">{venture.comentario}</p>

      {venture.contacto && (
        <p className="text-sm mb-2">
          <span className="font-bold">Contacto:</span> {venture.contacto}
        </p>
      )}

      <p className="text-sm mb-1">
        <span className="font-bold">Región:</span> {venture.region}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Tipo de inversión:</span> {venture.tipoInversion}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Foco:</span> {venture.foco}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Etapa:</span> {venture.etapa}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Monto promedio:</span> {venture.montoPromedio}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Perfil buscado:</span> {venture.perfilBuscado}
      </p>
      <p className="text-sm mb-1">
        <span className="font-bold">Convocatoria:</span> {venture.convocatoria}
      </p>
      <p className="text-sm">
        <span className="font-bold">Algoritmo:</span> {venture.algoritmo}
      </p>
    </div>
  );
};
