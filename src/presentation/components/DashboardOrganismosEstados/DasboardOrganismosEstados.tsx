import { useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { fetchOrganismos } from "../../../store/slices/organismosEstados/organismosEstados";
import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";
import { ItemOrganismosEstados } from "./OrganismosEstados/ItemOrganismosEstados";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
} from "../internal-shell";
import { ConfirmAction } from "../confirmation";
import { deleteRealtimeRecord } from "../../../firebase/realtimeRepository";

export const DashboardOrganismos = () => {
  const { organismos, loading, error } = useAppSelector(
    (state: RootState) => state.organismos
  );

  const [busqueda, setBusqueda] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useRealtimeList<OrganismoEstado>({
    path: "organismosEstado",
    action: fetchOrganismos,
    errorLabel: "organismos",
  });

  const organismosFiltrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return (organismos ?? []).filter((organismo: OrganismoEstado) =>
      busquedaNormalizada ? organismo.nombre.toLowerCase().includes(busquedaNormalizada) : true
    );
  }, [busqueda, organismos]);

  const selectedOrganismo = useMemo(
    () =>
      pendingDeleteId
        ? (organismos ?? []).find((organismo) => organismo.id === pendingDeleteId)
        : null,
    [organismos, pendingDeleteId]
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
      await deleteRealtimeRecord("organismosEstado", pendingDeleteId);
      setPendingDeleteId(null);
      alert("Organismo eliminado correctamente.");
    } catch (deleteError) {
      console.error("Error al eliminar organismo:", deleteError);
      alert("Error al eliminar el organismo.");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasNoResults = !loading && !error && organismosFiltrados.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Organismos del Estado"
        description="Revise el conjunto de datos de organismos del estado actual, filtre por nombre y use la confirmación para las eliminaciones."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {organismos?.length ?? 0} registros
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
              placeholder="Buscar organismos"
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
              description="La lista de organismos del estado no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron registros"
              description={
                busqueda
                  ? "No hay registros que coincidan con la búsqueda actual."
                  : "Aún no hay registros de organismos del estado disponibles."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {organismosFiltrados.map((organismo: OrganismoEstado) => (
                <ItemOrganismosEstados
                  key={organismo.id}
                  id={organismo.id!}
                  organismo={organismo}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmAction
        open={pendingDeleteId !== null}
        title={selectedOrganismo ? `¿Eliminar ${selectedOrganismo.nombre}?` : "¿Eliminar registro?"}
        description="Esta acción eliminará el registro seleccionado del nodo organismosEstado existente. Confirme solo si desea continuar."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        pending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
