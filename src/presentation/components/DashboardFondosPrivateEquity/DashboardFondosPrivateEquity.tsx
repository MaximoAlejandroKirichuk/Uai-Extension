import type { RootState } from "../../../store/store";
import {
  fetchFondosPrivateEquity,
  setError,
  setLoading,
} from "../../../store/slices/fondosPrivateEquity/fondosPrivateEquitySlice";
import type { FondoPrivateEquity } from "../../../core/entities/fondosPrivateEquity.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ArcapCollectionDashboard, ArcapRecordCard } from "../internal-shell";

export const DashboardFondosPrivateEquity = () => {
  const { fondosPrivateEquity, loading, error } = useAppSelector(
    (state: RootState) => state.fondosPrivateEquity
  );

  return (
    <ArcapCollectionDashboard<FondoPrivateEquity>
      path="fondosPrivateEquity"
      title="Fondos de private equity y otros vehiculos"
      description="Fondos relevados que no invierten en startups: private equity, search funds, family offices y buy and hold. Se listan aparte para que el radar de capital de riesgo no los mezcle."
      emptyDescription="Aun no hay fondos de private equity cargados."
      errorLabel="fondos de private equity"
      searchLabel="Buscar fondo"
      items={fondosPrivateEquity}
      loading={loading}
      error={error}
      fetchAction={fetchFondosPrivateEquity}
      setLoadingAction={setLoading}
      setErrorAction={setError}
      renderItem={(fondo) => (
        <ArcapRecordCard
          key={fondo.id}
          id={fondo.id!}
          record={fondo}
          lead={fondo.comentario}
          fields={[
            { label: "Region", value: fondo.region },
            { label: "Tipo de inversion", value: fondo.tipoInversion },
            { label: "Foco", value: fondo.foco },
            { label: "Etapa", value: fondo.etapa },
            { label: "Contacto", value: fondo.contacto },
            { label: "Empresa de respaldo", value: fondo.empresaRespaldo },
            { label: "Algoritmo", value: fondo.algoritmo },
          ]}
          lists={[{ label: "Portfolio declarado", items: fondo.portfolio }]}
        />
      )}
    />
  );
};
