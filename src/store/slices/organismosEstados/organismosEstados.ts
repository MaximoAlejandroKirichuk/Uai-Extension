import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";
import { createListSlice } from "../createListSlice";

const organismosSlice = createListSlice<OrganismoEstado, "organismos">({
  name: "organismos",
  itemsKey: "organismos",
  fetchAction: "fetchOrganismos",
});

export const { fetchOrganismos, setLoading, setError } =
  organismosSlice.actions;
export default organismosSlice.reducer;
