import { Universidad } from "../../../../core/entities/universidad.entity";
import { DashboardItemCard } from "../../internal-shell";

interface Props {
  uni: Universidad;
  id: string;
  onDelete: (id: string) => void;
  canDelete?: boolean;
}

export const ItemUniversidad = ({ uni, id, onDelete, canDelete = true }: Props) => {
  return (
    <DashboardItemCard
      title={uni.nombre}
      deleteLabel={`Eliminar ${uni.nombre}`}
      onDelete={() => onDelete(id)}
      canDelete={canDelete}
      footer={
        <>
          {uni.redes?.linkedin && (
            <a
              href={uni.redes.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[color:var(--color-brand)] underline decoration-[color:var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              LinkedIn
            </a>
          )}
          {uni.redes?.instagram && (
            <a
              href={uni.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[color:var(--color-brand)] underline decoration-[color:var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              Instagram
            </a>
          )}
          {uni.redes?.x && (
            <a
              href={uni.redes.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[color:var(--color-brand)] underline decoration-[color:var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              X
            </a>
          )}
        </>
      }
    >
      <p>
        {uni.descripcion}
      </p>

      {uni.contacto && (
        <p className="text-[color:var(--color-text)]">
          <span className="font-semibold">Contacto:</span> {uni.contacto}
        </p>
      )}
    </DashboardItemCard>
  );
};
