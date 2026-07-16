import { CapitalVentures } from "../../../../core/entities/capitalVentures.entity";
import { DashboardItemCard } from "../../internal-shell";

interface Props {
  venture: CapitalVentures;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemCapitalVenture = ({ venture, id, onDelete }: Props) => {
  return (
    <DashboardItemCard
      title={venture.nombre}
      deleteLabel={`Eliminar ${venture.nombre}`}
      onDelete={() => onDelete(id)}
    >
      <p>{venture.comentario}</p>

      {venture.contacto && (
        <p>
          <span className="font-semibold">Contacto:</span> {venture.contacto}
        </p>
      )}

      <p>
        <span className="font-semibold">Región:</span> {venture.region}
      </p>
      <p>
        <span className="font-semibold">Tipo de inversión:</span> {venture.tipoInversion}
      </p>
      <p>
        <span className="font-semibold">Foco:</span> {venture.foco}
      </p>
      <p>
        <span className="font-semibold">Etapa:</span> {venture.etapa}
      </p>
      <p>
        <span className="font-semibold">Monto promedio:</span> {venture.montoPromedio}
      </p>
      <p>
        <span className="font-semibold">Perfil buscado:</span> {venture.perfilBuscado}
      </p>
      <p>
        <span className="font-semibold">Convocatoria:</span> {venture.convocatoria}
      </p>
      <p>
        <span className="font-semibold">Algoritmo:</span> {venture.algoritmo}
      </p>
    </DashboardItemCard>
  );
};
