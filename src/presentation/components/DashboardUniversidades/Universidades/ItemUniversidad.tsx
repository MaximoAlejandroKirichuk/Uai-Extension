import { Universidad } from "../../../../core/entities/universidad.entity";

interface Props {
  uni: Universidad;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemUniversidad = ({ uni, id, onDelete }: Props) => {
  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-[color:var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-[color:var(--color-text)]">
          {uni.nombre}
        </h2>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-white focus:outline-none focus:ring-4 focus:ring-[color:var(--color-danger)]/20"
          onClick={() => onDelete(id)}
          title="Eliminar universidad"
          aria-label={`Eliminar ${uni.nombre}`}
        >
          <span aria-hidden="true">🗑️</span>
        </button>
      </div>

      <p className="mb-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
        {uni.descripcion}
      </p>

      {uni.contacto && (
        <p className="mb-3 text-sm text-[color:var(--color-text)]">
          <span className="font-semibold">Contacto:</span> {uni.contacto}
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
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
      </div>
    </div>
  );
};
