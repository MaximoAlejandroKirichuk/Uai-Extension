import type { ReactNode } from "react";

interface InternalPortalShellProps {
  title: string;
  description: string;
  navigation?: ReactNode;
  children: ReactNode;
}

export const InternalPortalShell = ({
  title,
  description,
  navigation,
  children,
}: InternalPortalShellProps) => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[color:var(--color-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <div className="border-b border-[color:var(--color-border)] px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--color-brand)]">
              Portal interno
            </p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-text-muted)] sm:text-base">
                  {description}
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                Extensión UAI
              </div>
            </div>
          </div>

          {navigation ? <div className="px-4 py-4 sm:px-6">{navigation}</div> : null}
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
