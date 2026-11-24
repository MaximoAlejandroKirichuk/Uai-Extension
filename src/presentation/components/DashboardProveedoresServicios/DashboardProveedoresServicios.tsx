import type { RootState } from "../../../store/store";
import {
  fetchProveedoresServicios,
  setError,
  setLoading,
} from "../../../store/slices/proveedoresServicios/proveedoresServiciosSlice";
import type { ProveedorServicios } from "../../../core/entities/proveedoresServicios.entity";
import { useAppSelector } from "../../../hooks/hooks";
import { ArcapCollectionDashboard, ArcapRecordCard } from "../internal-shell";

export const DashboardProveedoresServicios = () => {
  const { proveedoresServicios, loading, error } = useAppSelector(
    (state: RootState) => state.proveedoresServicios
  );

  return (
    <ArcapCollectionDashboard<ProveedorServicios>
      path="proveedoresServicios"
      title="Proveedores de servicios"
      description="Estudios juridicos, recruiters y consultoras que atienden al ecosistema. No invierten: acompanan a quienes invierten y a las startups."
      emptyDescription="Aun no hay proveedores de servicios cargados."
      errorLabel="proveedores de servicios"
      searchLabel="Buscar proveedor"
      items={proveedoresServicios}
      loading={loading}
      error={error}
      fetchAction={fetchProveedoresServicios}
      setLoadingAction={setLoading}
      setErrorAction={setError}
      renderItem={(proveedor) => (
        <ArcapRecordCard
          key={proveedor.id}
          id={proveedor.id!}
          record={proveedor}
          lead={proveedor.descripcion}
          fields={[
            { label: "Tipo de servicio", value: proveedor.tipoServicio },
            { label: "Area de startups y VC", value: proveedor.areaStartupsVc },
            { label: "Como trabajar con ellos", value: proveedor.comoTrabajarConEllos },
            { label: "Region", value: proveedor.region },
            { label: "Contacto", value: proveedor.contacto },
            { label: "Programas", value: proveedor.programas },
            { label: "Materiales", value: proveedor.materiales },
            { label: "Novedades", value: proveedor.novedades },
            { label: "Eventos", value: proveedor.eventos },
          ]}
        />
      )}
    />
  );
};
