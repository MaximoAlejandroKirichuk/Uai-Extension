import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const SectionHeader = ({ title, description, actions }: SectionHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-5 shadow-sm sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
          Sección
        </p>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-[color:var(--color-text)] sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
};
