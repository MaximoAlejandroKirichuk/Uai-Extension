import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { fetchOrganismos } from "../../../store/slices/organismosEstados/organismosEstados";
import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";
import { ref, onValue, remove, DataSnapshot } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import { ItemOrganismosEstados } from "./OrganismosEstados/ItemOrganismosEstados";
import { LoadingComponent } from "../loading/LoadingComponent";

export const DashboardOrganismos = () => {
  const dispatch = useAppDispatch();
  const { organismos, loading, error } = useAppSelector(
    (state: RootState) => state.organismos
  );

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const organismosRef = ref(database, "organismosEstado");

    const unsubscribe = onValue(
      organismosRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const organismosArray: OrganismoEstado[] = Object.entries(data).map(
            ([id, value]: [string, any]) => ({
              ...(value ?? {}),
              id,
            })
          );
          dispatch(fetchOrganismos(organismosArray));
        } else {
          dispatch(fetchOrganismos([]));
        }
      },
      (error) => {
        console.error("Error al obtener organismos:", error);
      }
    );

    return () => unsubscribe();
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `organismosEstado/${id}`));
      alert("Organismo eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar organismo:", error);
      alert("Error al eliminar el organismo.");
    }
  };

  const organismosFiltrados = organismos?.filter((organismo) =>
    organismo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Organismos del Estado</h1>

      {/* Filtro */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border p-2 rounded w-full sm:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Estado */}
      {loading && <LoadingComponent />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Lista */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {organismosFiltrados?.map((organismo) => (
          <ItemOrganismosEstados
            key={organismo.id}
            organismo={organismo}
            id={organismo.id!}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
