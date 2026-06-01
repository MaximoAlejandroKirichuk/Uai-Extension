import { useEffect, useMemo, useState } from "react";
import { DataSnapshot, onValue, ref } from "firebase/database";
import { Incubadora } from "../../../core/entities/incubadora.entity";
import { database } from "../../../firebase/firebaseConfig";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import {
  fetchIncubadoras,
  setError,
  setLoading,
} from "../../../store/slices/incubadoras/incubadorasSlice";
import { LoadingComponent } from "../loading/LoadingComponent";

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

export const DashboardIncubadoras = () => {
  const dispatch = useAppDispatch();
  const { incubadoras, loading, error } = useAppSelector(
    (state: RootState) => state.incubadoras
  );

  const [busqueda, setBusqueda] = useState("");
  const [provincia, setProvincia] = useState("");

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const incubadorasRef = ref(database, "incubadoras");

    const unsubscribe = onValue(
      incubadorasRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();

        if (data) {
          const incubadorasArray: Incubadora[] = Object.entries(data)
            .map(([id, value]: [string, unknown]) => ({
              ...((value ?? {}) as Omit<Incubadora, "id">),
              id,
            }))
            .sort(compareByRegistration);

          dispatch(fetchIncubadoras(incubadorasArray));
          return;
        }

        dispatch(fetchIncubadoras([]));
      },
      (error) => {
        console.error("Error al obtener incubadoras:", error);
        dispatch(setError("No se pudieron cargar las incubadoras."));
        dispatch(setLoading(false));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

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

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Dashboard de Incubadoras</h1>
        <p className="text-sm text-gray-600 mt-1">
          {incubadorasFiltradas.length} de {incubadoras.length} incubadoras
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, CUIT, responsable, email o localidad"
          className="border p-2 rounded w-full sm:w-2/3"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/3"
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
      </div>

      {loading && <LoadingComponent />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && incubadoras.length === 0 && (
        <p className="text-gray-700">No hay incubadoras cargadas.</p>
      )}

      {!loading && !error && incubadoras.length > 0 && (
        <>
          {incubadorasFiltradas.length === 0 ? (
            <p className="text-gray-700">
              {hasFilters
                ? "No se encontraron incubadoras con esos filtros."
                : "No hay incubadoras cargadas."}
            </p>
          ) : (
            <div className="overflow-x-auto rounded border bg-white shadow">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Nro</th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Nombre
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Provincia
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Localidad
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">CUIT</th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Responsable
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">
                      Telefono
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incubadorasFiltradas.map((incubadora) => (
                    <tr
                      key={incubadora.id}
                      className="border-t odd:bg-white even:bg-gray-50"
                    >
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.nroInscripcion)}
                      </td>
                      <td className="px-3 py-3 align-top font-medium text-blue-700">
                        {getText(incubadora.nombre)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.provincia)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.localidad)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.cuit)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.nombreResponsable)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.emailResponsable)}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {getText(incubadora.telefonoResponsable)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
