import { useState } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { fetchPlataformas } from "../../../store/slices/plataforma/plataforma";
import { Plataforma } from "../../../core/entities/plataformas.entity";
import { remove, ref } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import { ItemPlataforma } from "./Plataformas/ItemPlataforma";
import { LoadingComponent } from "../loading/LoadingComponent";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

export const DashboardPlataformas = () => {
  const { plataformas, loading, error } = useAppSelector(
    (state: RootState) => state.plataformas
  );

  const [busqueda, setBusqueda] = useState("");

  useRealtimeList<Plataforma>({
    path: "plataformas",
    action: fetchPlataformas,
    errorLabel: "plataformas",
  });

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `plataformas/${id}`));
      alert("Plataforma eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar plataforma:", error);
      alert("Error al eliminar la plataforma.");
    }
  };

  const plataformasFiltradas = plataformas?.filter((plataforma: Plataforma) =>
    plataforma.nombrePlataforma
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Plataformas</h1>

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
        {plataformasFiltradas?.map((plataforma: Plataforma) => (
          <ItemPlataforma
            key={plataforma.id}
            plataforma={plataforma}
            id={plataforma.id!}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
