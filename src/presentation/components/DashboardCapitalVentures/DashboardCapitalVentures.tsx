import { useMemo, useState } from "react";
import { RootState } from "../../../store/store";
import { fetchCapitalVentures } from "../../../store/slices/capitalVentures/capitalVentures";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ItemCapitalVenture } from "./CapitalVentures/ItemCapitalVentures";
import { remove, ref } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
} from "../internal-shell";
import { ConfirmAction } from "../confirmation";

export const DashboardCapitalVentures = () => {
  const { capitalVentures, loading, error } = useAppSelector(
    (state: RootState) => state.capitalVentures
  );

  const [busqueda, setBusqueda] = useState<string>("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useRealtimeList<CapitalVentures>({
    path: "capitalVentures",
    action: fetchCapitalVentures,
    errorLabel: "capital ventures",
  });

  const filtrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return (capitalVentures ?? []).filter((venture: CapitalVentures) =>
      busquedaNormalizada ? venture.nombre.toLowerCase().includes(busquedaNormalizada) : true
    );
  }, [busqueda, capitalVentures]);

  const selectedVenture = useMemo(
    () =>
      pendingDeleteId
        ? (capitalVentures ?? []).find((venture) => venture.id === pendingDeleteId)
        : null,
    [capitalVentures, pendingDeleteId]
  );

  const handleDeleteRequest = (id: string) => {
    setPendingDeleteId(id);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setPendingDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) {
      return;
    }

    setIsDeleting(true);

    try {
      await remove(ref(database, `capitalVentures/${pendingDeleteId}`));
      setPendingDeleteId(null);
      alert("Registro eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasNoResults = !loading && !error && filtrados.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Capital Ventures"
        description="Revise el conjunto de datos de Capital Ventures actual, filtre por nombre y use la confirmación para las eliminaciones."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {capitalVentures?.length ?? 0} registros
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
              placeholder="Buscar Capital Ventures"
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
              description="La lista de Capital Ventures no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron registros"
              description={
                busqueda
                  ? "No hay registros que coincidan con la búsqueda actual."
                  : "Aún no hay registros de Capital Ventures disponibles."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtrados.map((venture: CapitalVentures) => (
                <ItemCapitalVenture
                  key={venture.id}
                  id={venture.id!}
                  venture={venture}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmAction
        open={pendingDeleteId !== null}
        title={selectedVenture ? `¿Eliminar ${selectedVenture.nombre}?` : "¿Eliminar registro?"}
        description="Esta acción eliminará el registro seleccionado del nodo capitalVentures existente. Confirme solo si desea continuar."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        pending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
