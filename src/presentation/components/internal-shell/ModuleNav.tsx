import type { ReactNode } from "react";

export interface HomeModuleConfig {
  key: string;
  label: string;
  render: () => ReactNode;
}

interface ModuleNavProps {
  modules: HomeModuleConfig[];
  activeKey: string;
  onChange: (key: string) => void;
}

export const ModuleNav = ({ modules, activeKey, onChange }: ModuleNavProps) => {
  return (
    <nav aria-label="Módulos internos">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const isActive = module.key === activeKey;

          return (
            <button
              key={module.key}
              type="button"
              onClick={() => onChange(module.key)}
              aria-pressed={isActive}
              className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus)]/15 ${
                isActive
                  ? "border-[color:var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm"
                  : "border-[color:var(--color-border)] bg-white text-[color:var(--color-text)] hover:border-[color:var(--color-brand)] hover:bg-[var(--color-surface-muted)]"
              }`}
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.28em] opacity-75">
                Módulo
              </span>
              <span className="mt-2 block text-sm font-medium leading-5 sm:text-base">
                {module.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
