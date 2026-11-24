import { useMemo, useState, type ReactNode } from "react";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { ArcapTraceable } from "../../../core/entities/arcap.entity";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { EmptyState, ErrorState, LoadingState } from "./AsyncStates";
import { SectionHeader } from "./SectionHeader";

type ArcapRecord = ArcapTraceable & { nombre: string };

interface ArcapCollectionDashboardProps<T extends ArcapRecord> {
  path: string;
  title: string;
  description: string;
  emptyDescription: string;
  errorLabel: string;
  searchLabel: string;
  items?: T[];
  loading: boolean;
  error: string | null;
  fetchAction: ActionCreatorWithPayload<T[]>;
  setLoadingAction: ActionCreatorWithPayload<boolean>;
  setErrorAction: ActionCreatorWithPayload<string | null>;
  renderItem: (record: T) => ReactNode;
}

/**
 * Read-only list for the collections the ARCAP load created. They carry no
 * create or delete surface: the records are traceable to a cited source and are
 * curated in the review queue, not edited from here.
 *
 * Records marked `reemplazado` are dropped, so an actor loaded twice is listed
 * once.
 */
export const ArcapCollectionDashboard = <T extends ArcapRecord>({
  path,
  title,
  description,
  emptyDescription,
  errorLabel,
  searchLabel,
  items,
  loading,
  error,
  fetchAction,
  setLoadingAction,
  setErrorAction,
  renderItem,
}: ArcapCollectionDashboardProps<T>) => {
  const [busqueda, setBusqueda] = useState<string>("");

  useRealtimeList<T>({
    path,
    action: fetchAction,
    setLoadingAction,
    setErrorAction,
    errorMessage: "No se pudieron cargar los registros.",
    errorLabel,
  });

  const vigentes = useMemo(
    () => (items ?? []).filter((record) => record.estadoRevision !== "reemplazado"),
    [items]
  );

  const filtrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    if (!busquedaNormalizada) {
      return vigentes;
    }

    return vigentes.filter((record) =>
      (record.nombre ?? "").toLowerCase().includes(busquedaNormalizada)
    );
  }, [busqueda, vigentes]);

  const hasNoResults = !loading && !error && filtrados.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title={title}
        description={description}
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {vigentes.length} registros
          </div>
        }
      />

      <div className="rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
              Buscar por nombre
            </span>
            <input
              type="text"
              placeholder={searchLabel}
              className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              title="No se pudieron cargar los registros"
              description="La lista no se pudo cargar en este momento. Intente nuevamente mas tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron registros"
              description={
                busqueda
                  ? "No hay registros que coincidan con la busqueda actual."
                  : emptyDescription
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtrados.map(renderItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
