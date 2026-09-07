import { useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import {
  fetchPlataformas,
  setError,
  setLoading,
} from "../../../store/slices/plataforma/plataforma";
import { Plataforma } from "../../../core/entities/plataformas.entity";
import { ItemPlataforma } from "./Plataformas/ItemPlataforma";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
} from "../internal-shell";
import { ConfirmAction } from "../confirmation";

interface DashboardPlataformasProps {
  canWrite?: boolean;
}

export const DashboardPlataformas = ({ canWrite = true }: DashboardPlataformasProps) => {
  const { plataformas, loading, error } = useAppSelector(
    (state: RootState) => state.plataformas
  );

  const [busqueda, setBusqueda] = useState("");

  useRealtimeList<Plataforma>({
    path: "plataformas",
    action: fetchPlataformas,
    setLoadingAction: setLoading,
    setErrorAction: setError,
    errorMessage: "No se pudieron cargar los registros.",
    errorLabel: "plataformas",
  });

  const {
    selectedItem: selectedPlataforma,
    isDeleting,
    isOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation<Plataforma>({
    path: "plataformas",
    items: plataformas ?? [],
    getId: (plataforma) => plataforma.id!,
    onSuccessMessage: "Plataforma eliminada correctamente.",
    onErrorMessage: "Error al eliminar la plataforma.",
    canWrite,
  });

  const plataformasFiltradas = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return (plataformas ?? []).filter((plataforma: Plataforma) =>
      busquedaNormalizada
        ? plataforma.nombrePlataforma.toLowerCase().includes(busquedaNormalizada)
        : true
    );
  }, [busqueda, plataformas]);

  const hasNoResults = !loading && !error && plataformasFiltradas.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Plataformas"
        description="Revise el conjunto de datos de Plataformas actual, filtre por nombre y use la confirmación para las eliminaciones."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {plataformas?.length ?? 0} registros
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
              placeholder="Buscar Plataformas"
              className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              title="No se pudieron cargar los registros"
              description="La lista de Plataformas no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron registros"
              description={
                busqueda
                  ? "No hay registros que coincidan con la búsqueda actual."
                  : "Aún no hay registros de Plataformas disponibles."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {plataformasFiltradas.map((plataforma: Plataforma) => (
                <ItemPlataforma
                  key={plataforma.id}
                  id={plataforma.id!}
                  plataforma={plataforma}
                  onDelete={requestDelete}
                  canDelete={canWrite}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmAction
        open={isOpen}
        title={selectedPlataforma ? `¿Eliminar ${selectedPlataforma.nombrePlataforma}?` : "¿Eliminar registro?"}
        description="Esta acción eliminará el registro seleccionado del nodo plataformas existente. Confirme solo si desea continuar."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        pending={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};
