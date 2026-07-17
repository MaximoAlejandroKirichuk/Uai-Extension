import { OrganismoEstado } from "../../../../core/entities/organismosEstado.entity";
import { DashboardItemCard } from "../../internal-shell";

interface Props {
  organismo: OrganismoEstado;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemOrganismosEstados = ({ organismo, id, onDelete }: Props) => {
  return (
    <DashboardItemCard
      title={organismo.nombre}
      deleteLabel={`Eliminar ${organismo.nombre}`}
      onDelete={() => onDelete(id)}
    >
      <p>
        <span className="font-semibold">Área:</span> {organismo.area}
      </p>
      <p>{organismo.descripcion}</p>

      <p>
        <span className="font-semibold">Programas:</span> {organismo.programas}
      </p>
      <p>
        <span className="font-semibold">Tipos de financiamiento:</span> {organismo.tiposFinanciamiento}
      </p>
      <p>
        <span className="font-semibold">Fechas relevantes:</span> {organismo.fechasRelevantes}
      </p>
      <p>
        <span className="font-semibold">Requisitos acceso:</span> {organismo.requisitosAcceso}
      </p>
      <p>
        <span className="font-semibold">Contacto:</span> {organismo.contacto}
      </p>
      <p>
        <span className="font-semibold">Enlaces:</span>{" "}
        <a
          href={organismo.enlaces}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--color-brand)] underline decoration-[color:var(--color-border)] underline-offset-4 transition hover:opacity-80"
        >
          {organismo.enlaces}
        </a>
      </p>
      <p>
        <span className="font-semibold">Estado seguimiento:</span> {organismo.estadoSeguimiento}
      </p>
      <p>
        <span className="font-semibold">Beneficiarios:</span> {organismo.beneficiarios}
      </p>
      <p>
        <span className="font-semibold">Alianzas:</span> {organismo.alianzas}
      </p>
    </DashboardItemCard>
  );
};
