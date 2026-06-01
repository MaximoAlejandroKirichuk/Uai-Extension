import { useState } from "react";
import { RootState } from "../../../store/store";
import { fetchCapitalVentures } from "../../../store/slices/capitalVentures/capitalVentures";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { LoadingComponent } from "../loading/LoadingComponent";
import { ItemCapitalVenture } from "./CapitalVentures/ItemCapitalVentures";
import { remove, ref } from "firebase/database";
import { database } from "../../../firebase/firebaseConfig";
import { useRealtimeList } from "../../../hooks/useRealtimeList";

export const DashboardCapitalVentures = () => {
  const { capitalVentures, loading, error } = useAppSelector(
    (state: RootState) => state.capitalVentures
  );

  const [busqueda, setBusqueda] = useState<string>("");

  useRealtimeList<CapitalVentures>({
    path: "capitalVentures",
    action: fetchCapitalVentures,
    errorLabel: "capital ventures",
  });

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(database, `capitalVentures/${id}`));
      alert("Registro eliminado");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar");
    }
  };

  const filtrados = capitalVentures?.filter((venture: CapitalVentures) =>
    venture.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 max-h-full flex-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard de Capital Ventures</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border p-2 rounded w-full sm:w-1/2"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {loading && <LoadingComponent />}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados?.map((venture: CapitalVentures) => (
          <ItemCapitalVenture
            key={venture.id}
            id={venture.id!}
            venture={venture}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
