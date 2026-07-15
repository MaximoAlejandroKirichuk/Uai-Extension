import type { ReactNode } from "react";

interface AsyncStateProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const StateShell = ({ title, description, children }: AsyncStateProps) => {
  return (
    <div className="rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-10 shadow-sm">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        {children}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[color:var(--color-text)]">{title}</h3>
          <p className="text-sm leading-6 text-[color:var(--color-text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const LoadingState = () => {
  return (
    <StateShell
      title="Cargando contenido"
      description="Espere mientras se prepara la vista actual."
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--color-border)] border-t-[color:var(--color-brand)]"
      />
    </StateShell>
  );
};

export const EmptyState = ({ title, description }: AsyncStateProps) => {
  return (
    <StateShell title={title} description={description}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-lg font-semibold text-[color:var(--color-brand)]">
        •
      </div>
    </StateShell>
  );
};

export const ErrorState = ({ title, description }: AsyncStateProps) => {
  return (
    <StateShell title={title} description={description}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-danger)]/10 text-lg font-semibold text-[color:var(--color-danger)]">
        !
      </div>
    </StateShell>
  );
};
