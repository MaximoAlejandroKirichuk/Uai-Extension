import { Plataforma } from "../../../core/entities/plataformas.entity";
import { createListSlice } from "../createListSlice";

const plataformaSlice = createListSlice<Plataforma, "plataformas">({
  name: "plataformas",
  itemsKey: "plataformas",
  fetchAction: "fetchPlataformas",
});

export const { fetchPlataformas, setLoading, setError } =
  plataformaSlice.actions;

export default plataformaSlice.reducer;
