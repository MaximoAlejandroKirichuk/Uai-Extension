import { useState } from "react";
import { RootState } from "../../../store/store";
import { fetchCrowfundings } from "../../../store/slices/crowfunding/crowfundingSlice";
import { Crowfunding } from "../../../core/entities/crowfunding.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { LoadingComponent } from "../loading/LoadingComponent";
import { ItemCrowfunding } from "./Crowfunding/ItemCrowfunding";
import { remove, ref } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

export const DashboardCrowfunding = () => {
  const { crowfundings, loading, error } = useAppSelector(
    (state: RootState) => state.crowfundings
  );

  const [busqueda, setBusqueda] = useState<string>("");


  useRealtimeList<Crowfunding>({
    path: "crowfundings",
    action: fetchCrowfundings,
    errorLabel: "proyectos",
  });

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `crowfundings/${id}`));
      alert("Proyecto eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    }
  };

  const crowfundingsFiltrados = crowfundings?.filter((proyecto: Crowfunding) => {
    const coincideNombre = proyecto.nombrePlataforma.toLowerCase().includes(busqueda.toLowerCase());
    return coincideNombre 
  });

  return (
    <div className="p-6 max-h-full flex-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Proyectos Crowfunding</h1>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre del proyecto"
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
        {crowfundingsFiltrados?.map((proyecto: Crowfunding) => (
          <ItemCrowfunding
            id={proyecto.id!}
            onDelete={handleDelete}
            key={proyecto.id}
            crowfunding={proyecto} 
          />
        ))}
      </div>
    </div>
  );
};
