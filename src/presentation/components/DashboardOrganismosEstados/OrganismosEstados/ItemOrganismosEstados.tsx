import { OrganismoEstado } from "../../../../core/entities/organismosEstado.entity";

interface Props {
  organismo: OrganismoEstado;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemOrganismosEstados = ({ organismo, id, onDelete }: Props) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold text-indigo-700">{organismo.nombre}</h2>
        <button
          className="transition-transform duration-200 hover:scale-110 cursor-pointer"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      <p className="text-gray-700 mb-2"><strong>Área:</strong> {organismo.area}</p>
      <p className="text-gray-700 mb-2">{organismo.descripcion}</p>

      <p className="text-sm"><strong>Programas:</strong> {organismo.programas}</p>
      <p className="text-sm"><strong>Tipos de financiamiento:</strong> {organismo.tiposFinanciamiento}</p>
      <p className="text-sm"><strong>Fechas relevantes:</strong> {organismo.fechasRelevantes}</p>
      <p className="text-sm"><strong>Requisitos acceso:</strong> {organismo.requisitosAcceso}</p>
      <p className="text-sm"><strong>Contacto:</strong> {organismo.contacto}</p>
      <p className="text-sm"><strong>Enlaces:</strong> <a href={organismo.enlaces} target="_blank" rel="noreferrer" className="text-blue-600 underline">{organismo.enlaces}</a></p>
      <p className="text-sm"><strong>Estado seguimiento:</strong> {organismo.estadoSeguimiento}</p>
      <p className="text-sm"><strong>Beneficiarios:</strong> {organismo.beneficiarios}</p>
      <p className="text-sm"><strong>Alianzas:</strong> {organismo.alianzas}</p>
    </div>
  );
};
