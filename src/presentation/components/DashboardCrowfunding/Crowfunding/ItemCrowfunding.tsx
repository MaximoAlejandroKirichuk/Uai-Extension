import { Crowfunding } from "../../../../core/entities/crowfunding.entity";
import { DashboardItemCard } from "../../internal-shell";

interface Props {
  crowfunding: Crowfunding;
  id: string;
  onDelete: (id: string) => void;
  canDelete?: boolean;
}

export const ItemCrowfunding = ({ crowfunding, id, onDelete, canDelete = true }: Props) => {
  return (
    <DashboardItemCard
      title={crowfunding.nombrePlataforma}
      deleteLabel={`Eliminar ${crowfunding.nombrePlataforma}`}
      onDelete={() => onDelete(id)}
      canDelete={canDelete}
    >
      <p>{crowfunding.descripcion}</p>

      {crowfunding.contacto && (
        <p className="text-[color:var(--color-text)]">
          <span className="font-semibold">Contacto:</span> {crowfunding.contacto}
        </p>
      )}

      <p className="text-[color:var(--color-text)]">
        <span className="font-semibold">Facilidad de uso:</span> {crowfunding.facilidadUso}
      </p>
      <p className="text-[color:var(--color-text)]">
        <span className="font-semibold">Algoritmo:</span> {crowfunding.algoritmo}
      </p>
      <p className="text-[color:var(--color-text)]">
        <span className="font-semibold">Comisiones:</span> {crowfunding.comisiones}
      </p>
    </DashboardItemCard>
  );
};
