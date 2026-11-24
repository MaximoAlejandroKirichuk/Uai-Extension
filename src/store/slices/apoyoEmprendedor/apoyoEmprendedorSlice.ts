import { ApoyoEmprendedor } from "../../../core/entities/apoyoEmprendedor.entity";
import { createListSlice } from "../createListSlice";

const apoyoEmprendedorSlice = createListSlice<
  ApoyoEmprendedor,
  "apoyoEmprendedor"
>({
  name: "apoyoEmprendedor",
  itemsKey: "apoyoEmprendedor",
  fetchAction: "fetchApoyoEmprendedor",
});

export const { fetchApoyoEmprendedor, setLoading, setError } =
  apoyoEmprendedorSlice.actions;

export default apoyoEmprendedorSlice.reducer;
