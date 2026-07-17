import { useId, type ReactNode } from "react";

interface DashboardItemCardProps {
  title: string;
  deleteLabel: string;
  onDelete: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export const DashboardItemCard = ({
  title,
  deleteLabel,
  onDelete,
  children,
  footer,
}: DashboardItemCardProps) => {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-[color:var(--color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-[color:var(--color-text)]">
          {title}
        </h2>
        <DeleteIconButton label={deleteLabel} onClick={onDelete} />
      </div>

      <div className="space-y-3 text-sm leading-6 text-[color:var(--color-text-muted)]">
        {children}
      </div>

      {footer ? <div className="mt-auto flex flex-wrap gap-2 pt-4">{footer}</div> : null}
    </article>
  );
};

interface DeleteIconButtonProps {
  label: string;
  onClick: () => void;
}

export const DeleteIconButton = ({ label, onClick }: DeleteIconButtonProps) => {
  const descriptionId = useId();

  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-danger)]/30 bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-[var(--color-danger)] hover:text-white hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[color:var(--color-danger)]/20"
        onClick={onClick}
        aria-label={label}
        aria-describedby={descriptionId}
      >
        <span aria-hidden="true">🗑️</span>
      </button>
      <span
        id={descriptionId}
        role="tooltip"
        className="pointer-events-none absolute right-0 top-12 z-10 w-48 rounded-2xl border border-[color:var(--color-danger)]/20 bg-[var(--color-danger)] px-3 py-2 text-xs font-semibold leading-5 text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        Borra para siempre este registro.
      </span>
    </span>
  );
};
