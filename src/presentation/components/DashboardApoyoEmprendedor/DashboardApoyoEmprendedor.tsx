import type { RootState } from "../../../store/store";
import {
  fetchApoyoEmprendedor,
  setError,
  setLoading,
} from "../../../store/slices/apoyoEmprendedor/apoyoEmprendedorSlice";
import type { ApoyoEmprendedor } from "../../../core/entities/apoyoEmprendedor.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ArcapCollectionDashboard, ArcapRecordCard } from "../internal-shell";

export const DashboardApoyoEmprendedor = () => {
  const { apoyoEmprendedor, loading, error } = useAppSelector(
    (state: RootState) => state.apoyoEmprendedor
  );

  return (
    <ArcapCollectionDashboard<ApoyoEmprendedor>
      path="apoyoEmprendedor"
      title="Apoyo al emprendedor"
      description="Aceleradoras, incubadoras y company builders relevados en el directorio de ARCAP. Acompanan a quien emprende sin ser, en si mismos, un fondo."
      emptyDescription="Aun no hay entidades de apoyo cargadas."
      errorLabel="apoyo al emprendedor"
      searchLabel="Buscar entidad"
      items={apoyoEmprendedor}
      loading={loading}
      error={error}
      fetchAction={fetchApoyoEmprendedor}
      setLoadingAction={setLoading}
      setErrorAction={setError}
      renderItem={(entidad) => (
        <ArcapRecordCard
          key={entidad.id}
          id={entidad.id!}
          record={entidad}
          lead={entidad.tipoEntidad}
          fields={[
            { label: "Tipo de apoyo", value: entidad.tipoApoyo },
            { label: "A quien apoya", value: entidad.aQuienApoya },
            { label: "Programas", value: entidad.programas },
            { label: "Foco", value: entidad.foco },
            { label: "Etapa", value: entidad.etapa },
            { label: "Region", value: entidad.region },
            { label: "Cobertura geografica", value: entidad.coberturaGeografica },
            { label: "Convocatoria", value: entidad.convocatoria },
            { label: "Costo de participacion", value: entidad.costoParticipacion },
            { label: "Monto promedio", value: entidad.montoPromedio },
            { label: "Contacto", value: entidad.contacto },
          ]}
        />
      )}
    />
  );
};
