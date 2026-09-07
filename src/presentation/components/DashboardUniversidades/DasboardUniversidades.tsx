import { useMemo, useState } from "react";
import { RootState } from "../../../store/store";
import {
  fetchUniversidades,
  setError,
  setLoading,
} from "../../../store/slices/universidades/universidadesSlice";
import { Universidad } from "../../../core/entities/universidad.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ItemUniversidad } from "./Universidades/ItemUniversidad";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
} from "../internal-shell";
import { ConfirmAction } from "../confirmation";

interface DashboardUniversidadesProps {
  canWrite?: boolean;
}

export const DashboardUniversidades = ({ canWrite = true }: DashboardUniversidadesProps) => {
  const { universidades, loading, error } = useAppSelector(
    (state: RootState) => state.universidades
  );

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroRed, setFiltroRed] = useState<string>("");

  useRealtimeList<Universidad>({
    path: "universidades",
    action: fetchUniversidades,
    setLoadingAction: setLoading,
    setErrorAction: setError,
    errorMessage: "No se pudieron cargar las universidades.",
  });

  const {
    selectedItem: selectedUniversity,
    isDeleting,
    isOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation<Universidad>({
    path: "universidades",
    items: universidades ?? [],
    getId: (uni) => uni.id!,
    onSuccessMessage: "Universidad eliminada correctamente.",
    onErrorMessage: "Error al eliminar la universidad.",
    canWrite,
  });

  const universidadesFiltradas = useMemo(() => {
    return (universidades ?? []).filter((uni: Universidad) => {
      const coincideNombre = uni.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideRed = filtroRed
        ? uni.redes?.[filtroRed as keyof typeof uni.redes]
        : true;

      return coincideNombre && coincideRed;
    });
  }, [busqueda, filtroRed, universidades]);

  const hasNoResults = !loading && !error && universidadesFiltradas.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Panel de universidades"
        description="Revise el conjunto de datos de universidades actual, refine la lista con filtros y use la confirmación para las eliminaciones."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {universidades?.length ?? 0} registros
          </div>
        }
      />

      <div className="rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Buscar por nombre
              </span>
              <input
                type="text"
                placeholder="Buscar universidades"
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Filtro por red
              </span>
              <select
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
                value={filtroRed}
                onChange={(e) => setFiltroRed(e.target.value)}
              >
                <option value="">Todas las redes</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="x">X</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              title="No se pudieron cargar las universidades"
              description="La lista de universidades no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron universidades"
              description={
                busqueda || filtroRed
                  ? "No hay registros que coincidan con la búsqueda o el filtro actual."
                  : "Aún no hay registros de universidades disponibles."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {universidadesFiltradas.map((uni: Universidad) => (
                <ItemUniversidad
                  id={uni.id!}
                  onDelete={requestDelete}
                  canDelete={canWrite}
                  key={uni.id}
                  uni={uni}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmAction
        open={isOpen}
        title={selectedUniversity ? `¿Eliminar ${selectedUniversity.nombre}?` : "¿Eliminar universidad?"}
        description="Esta acción eliminará la universidad seleccionada del nodo universidades existente. Confirme solo si desea continuar."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        pending={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};
