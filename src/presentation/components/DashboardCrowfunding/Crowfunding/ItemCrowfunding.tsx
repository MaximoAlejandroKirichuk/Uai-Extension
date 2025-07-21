import { Crowfunding } from "../../../../core/entities/crowfunding.entity";

interface Props {
  crowfunding: Crowfunding;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemCrowfunding = ({ crowfunding, id, onDelete }: Props) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-green-700">
          {crowfunding.nombrePlataforma}
        </h2>
        <button
          className="transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      <p className="text-gray-700 mb-2">{crowfunding.descripcion}</p>

      {crowfunding.contacto && (
        <p className="text-sm mb-2">
          <span className="font-bold">Contacto:</span> {crowfunding.contacto}
        </p>
      )}

      <p className="text-sm mb-1">
        <span className="font-bold">Facilidad de uso:</span> {crowfunding.facilidadUso}
      </p>

      <p className="text-sm">
        <span className="font-bold">Comisiones:</span> {crowfunding.comisiones}
      </p>
    </div>
  );
};
