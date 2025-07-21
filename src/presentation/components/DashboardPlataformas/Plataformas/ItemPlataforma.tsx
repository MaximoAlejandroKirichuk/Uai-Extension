// src/features/plataformas/components/ItemPlataforma.tsx
import { Plataforma } from "../../../../core/entities/plataformas.entity";

interface Props {
  plataforma: Plataforma;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemPlataforma = ({ plataforma, id, onDelete }: Props) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-blue-700">
          {plataforma.nombrePlataforma}
        </h2>
        <button
          className="transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      <p className="text-gray-700 mb-2">{plataforma.descripcion}</p>

      {plataforma.contacto && (
        <p className="text-sm mb-2">
          <span className="font-bold">Contacto:</span> {plataforma.contacto}
        </p>
      )}

      <p className="text-sm"><span className="font-bold">Tipo:</span> {plataforma.tipoPlataforma}</p>
      <p className="text-sm"><span className="font-bold">Industria:</span> {plataforma.industria}</p>
      <p className="text-sm"><span className="font-bold">Etapa:</span> {plataforma.etapaCubre}</p>
      <p className="text-sm"><span className="font-bold">Monto promedio:</span> {plataforma.montoPromedio}</p>
      <p className="text-sm"><span className="font-bold">Requisitos:</span> {plataforma.requisitosAcceso}</p>
      <p className="text-sm"><span className="font-bold">Costo/Comisión:</span> {plataforma.costoComision}</p>
      <p className="text-sm"><span className="font-bold">Algoritmo:</span> {plataforma.algoritmo}</p>
    </div>
  );
};
