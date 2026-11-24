import { ProveedorServicios } from "../../../core/entities/proveedoresServicios.entity";
import { createListSlice } from "../createListSlice";

const proveedoresServiciosSlice = createListSlice<
  ProveedorServicios,
  "proveedoresServicios"
>({
  name: "proveedoresServicios",
  itemsKey: "proveedoresServicios",
  fetchAction: "fetchProveedoresServicios",
});

export const { fetchProveedoresServicios, setLoading, setError } =
  proveedoresServiciosSlice.actions;

export default proveedoresServiciosSlice.reducer;
