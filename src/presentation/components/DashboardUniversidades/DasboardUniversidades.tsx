import { useEffect, useState } from "react";
import { RootState } from "../../../store/store";
import { fetchUniversidades } from "../../../store/slices/universidades/universidadesSlice";
import { Universidad } from "../../../core/entities/universidad.entity";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { LoadingComponent } from "../loading/LoadingComponent";
import { ItemUniversidad } from "./Universidades/ItemUniversidad";
import { ref, onValue, remove, DataSnapshot } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";

export const DashboardUniversidades = () => {
  const dispatch = useAppDispatch();

  const { universidades, loading, error } = useAppSelector(
    (state: RootState) => state.universidades
  );

  const [busqueda, setBusqueda] = useState<string>("");
  const [filtroRed, setFiltroRed] = useState<string>("");

  useEffect(() => {
    const universidadesRef = ref(database, "universidades");

    // Listener en tiempo real de las universidades
    const unsubscribe = onValue(
      universidadesRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const universidadesArray: Universidad[] = Object.entries(data).map(
            ([id, uni]) => ({
              ...uni,
              id, // Añadimos el id de Firebase
            })
          );
          dispatch(fetchUniversidades(universidadesArray));  // Actualiza el estado con los datos obtenidos
        } else {
          dispatch(fetchUniversidades([]));  // Si no hay datos, vaciar la lista
        }
      },
      (error) => {
        console.error("Error al obtener universidades:", error);
      }
    );

    // Limpiar el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `universidades/${id}`));
      alert("Universidad eliminada");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    }
  };

  const universidadesFiltradas = universidades?.filter((uni: Universidad) => {
    const coincideNombre = uni.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRed = filtroRed
      ? uni.redes?.[filtroRed as keyof typeof uni.redes]
      : true;
    return coincideNombre && coincideRed;
  });

  return (
    <div className="p-6 max-h-full flex-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Universidades</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border p-2 rounded w-full sm:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full sm:w-1/3"
          value={filtroRed}
          onChange={(e) => setFiltroRed(e.target.value)}
        >
          <option value="">Todas las redes</option>
          <option value="linkedin">LinkedIn</option>
          <option value="instagram">Instagram</option>
          <option value="x">X (Twitter)</option>
        </select>
      </div>

      {/* Estado */}
      {loading && <LoadingComponent />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {universidadesFiltradas?.map((uni: Universidad) => (
          <ItemUniversidad
            id={uni.id!} // Este debe ser el ID de Firebase
            onDelete={handleDelete}
            key={uni.id}
            uni={uni}
          />
        ))}
      </div>
    </div>
  );
};
