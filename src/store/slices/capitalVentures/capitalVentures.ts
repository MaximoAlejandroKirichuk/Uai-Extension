import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";
import { createListSlice } from "../createListSlice";

const capitalVenturesSlice = createListSlice<CapitalVentures, "capitalVentures">({
  name: "capitalVentures",
  itemsKey: "capitalVentures",
  fetchAction: "fetchCapitalVentures",
});

export const { fetchCapitalVentures, setLoading, setError } =
  capitalVenturesSlice.actions;

export default capitalVenturesSlice.reducer;
