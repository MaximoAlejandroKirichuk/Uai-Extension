import { useMemo, useState } from "react";
import { RootState } from "../../../store/store";
import { fetchCrowfundings } from "../../../store/slices/crowfunding/crowfundingSlice";
import { Crowfunding } from "../../../core/entities/crowfunding.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ItemCrowfunding } from "./Crowfunding/ItemCrowfunding";
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

export const DashboardCrowfunding = () => {
  const { crowfundings, loading, error } = useAppSelector(
    (state: RootState) => state.crowfundings
  );

  const [busqueda, setBusqueda] = useState<string>("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useRealtimeList<Crowfunding>({
    path: "crowfundings",
    action: fetchCrowfundings,
    errorLabel: "proyectos",
  });

  const crowfundingsFiltrados = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return (crowfundings ?? []).filter((proyecto: Crowfunding) =>
      busquedaNormalizada ? proyecto.nombrePlataforma.toLowerCase().includes(busquedaNormalizada) : true
    );
  }, [busqueda, crowfundings]);

  const selectedCrowfunding = useMemo(
    () =>
      pendingDeleteId
        ? (crowfundings ?? []).find((proyecto) => proyecto.id === pendingDeleteId)
        : null,
    [crowfundings, pendingDeleteId]
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
      await remove(ref(database, `crowfundings/${pendingDeleteId}`));
      setPendingDeleteId(null);
      alert("Proyecto eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasNoResults = !loading && !error && (crowfundingsFiltrados?.length ?? 0) === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Proyectos Crowfunding"
        description="Revise el conjunto de datos de proyectos crowdfunding actual y refine la lista por plataforma."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {crowfundings?.length ?? 0} registros
          </div>
        }
      />

      <div className="rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
              Buscar por plataforma
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre del proyecto"
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
              title="No se pudieron cargar los proyectos"
              description="La lista de proyectos crowdfunding no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron proyectos"
              description={
                busqueda
                  ? "No hay registros que coincidan con la búsqueda actual."
                  : "Aún no hay registros de proyectos crowdfunding disponibles."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {crowfundingsFiltrados?.map((proyecto: Crowfunding) => (
                <ItemCrowfunding
                  id={proyecto.id!}
                  onDelete={handleDeleteRequest}
                  key={proyecto.id}
                  crowfunding={proyecto}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmAction
        open={pendingDeleteId !== null}
        title={selectedCrowfunding ? `¿Eliminar ${selectedCrowfunding.nombrePlataforma}?` : "¿Eliminar proyecto?"}
        description="Esta acción eliminará el registro seleccionado del nodo crowfundings existente. Confirme solo si desea continuar."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        pending={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
