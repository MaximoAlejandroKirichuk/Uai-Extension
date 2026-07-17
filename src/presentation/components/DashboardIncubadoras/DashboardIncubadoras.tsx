import { useMemo, useState } from "react";
import { Incubadora } from "../../../core/entities/incubadora.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import {
  fetchIncubadoras,
  setError,
  setLoading,
} from "../../../store/slices/incubadoras/incubadorasSlice";
import { useRealtimeList } from "../../../hooks/useRealtimeList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
} from "../internal-shell";

const getText = (value?: string) => value?.trim() || "-";

const getSearchableText = (incubadora: Incubadora) =>
  [
    incubadora.nombre,
    incubadora.cuit,
    incubadora.nombreResponsable,
    incubadora.emailResponsable,
    incubadora.localidad,
    incubadora.provincia,
  ]
    .join(" ")
    .toLowerCase();

const compareByRegistration = (a: Incubadora, b: Incubadora) => {
  const first = Number(a.nroInscripcion);
  const second = Number(b.nroInscripcion);

  if (Number.isFinite(first) && Number.isFinite(second)) {
    return first - second;
  }

  return a.nroInscripcion.localeCompare(b.nroInscripcion);
};

const sortByRegistration = (items: Incubadora[]) =>
  [...items].sort(compareByRegistration);

export const DashboardIncubadoras = () => {
  const { incubadoras, loading, error } = useAppSelector(
    (state: RootState) => state.incubadoras
  );

  const [busqueda, setBusqueda] = useState("");
  const [provincia, setProvincia] = useState("");

  useRealtimeList<Incubadora>({
    path: "incubadoras",
    action: fetchIncubadoras,
    setLoadingAction: setLoading,
    setErrorAction: setError,
    errorMessage: "No se pudieron cargar las incubadoras.",
    errorLabel: "incubadoras",
    transformItems: sortByRegistration,
  });

  const provincias = useMemo(
    () =>
      Array.from(
        new Set(
          incubadoras
            .map((incubadora) => incubadora.provincia?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [incubadoras]
  );

  const incubadorasFiltradas = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    return incubadoras.filter((incubadora) => {
      const coincideBusqueda = busquedaNormalizada
        ? getSearchableText(incubadora).includes(busquedaNormalizada)
        : true;
      const coincideProvincia = provincia
        ? incubadora.provincia === provincia
        : true;

      return coincideBusqueda && coincideProvincia;
    });
  }, [busqueda, incubadoras, provincia]);

  const hasFilters = busqueda.trim() !== "" || provincia !== "";
  const hasNoResults = !loading && !error && incubadorasFiltradas.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Incubadoras"
        description="Revise el conjunto de datos de incubadoras actual y filtre por nombre o provincia sin cambiar el formato tabular."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {incubadoras?.length ?? 0} registros
          </div>
        }
      />

      <div className="rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Buscar por nombre, CUIT, responsable, email o localidad
              </span>
              <input
                type="text"
                placeholder="Buscar incubadoras"
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[color:var(--color-text-muted)]">
                Filtrar por provincia
              </span>
              <select
                className="w-full rounded-2xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-text)] outline-none transition focus:border-[color:var(--color-focus)] focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
                value={provincia}
                onChange={(event) => setProvincia(event.target.value)}
              >
                <option value="">Todas las provincias</option>
                {provincias.map((provincia) => (
                  <option key={provincia} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              title="No se pudieron cargar las incubadoras"
              description="La lista de incubadoras no se pudo cargar en este momento. Intente nuevamente más tarde."
            />
          ) : hasNoResults ? (
            <EmptyState
              title="No se encontraron incubadoras"
              description={
                hasFilters
                  ? "No hay incubadoras que coincidan con la búsqueda o el filtro actual."
                  : "Aún no hay incubadoras cargadas."
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-[1.5rem] border border-[color:var(--color-border)] bg-white shadow-sm">
              <table className="min-w-[1100px] w-full text-sm text-[color:var(--color-text)]">
                <thead className="bg-[var(--color-surface-muted)] text-[color:var(--color-text)]">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Nro</th>
                    <th className="px-3 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-3 py-3 text-left font-semibold">Provincia</th>
                    <th className="px-3 py-3 text-left font-semibold">Localidad</th>
                    <th className="px-3 py-3 text-left font-semibold">CUIT</th>
                    <th className="px-3 py-3 text-left font-semibold">Responsable</th>
                    <th className="px-3 py-3 text-left font-semibold">Email</th>
                    <th className="px-3 py-3 text-left font-semibold">Telefono</th>
                  </tr>
                </thead>
                <tbody>
                  {incubadorasFiltradas.map((incubadora) => (
                    <tr
                      key={incubadora.id}
                      className="border-t border-[color:var(--color-border)] odd:bg-white even:bg-[var(--color-surface)]"
                    >
                      <td className="px-3 py-3 align-top">{getText(incubadora.nroInscripcion)}</td>
                      <td className="px-3 py-3 align-top font-medium text-[color:var(--color-brand)]">
                        {getText(incubadora.nombre)}
                      </td>
                      <td className="px-3 py-3 align-top">{getText(incubadora.provincia)}</td>
                      <td className="px-3 py-3 align-top">{getText(incubadora.localidad)}</td>
                      <td className="px-3 py-3 align-top">{getText(incubadora.cuit)}</td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.nombreResponsable)}
                      </td>
                      <td className="px-3 py-3 align-top">{getText(incubadora.emailResponsable)}</td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.telefonoResponsable)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
