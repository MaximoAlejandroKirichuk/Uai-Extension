import { Incubadora } from "../../../core/entities/incubadora.entity";
import { createListSlice } from "../createListSlice";

const incubadorasSlice = createListSlice<Incubadora, "incubadoras">({
  name: "incubadoras",
  itemsKey: "incubadoras",
  fetchAction: "fetchIncubadoras",
});

export const { fetchIncubadoras, setLoading, setError } =
  incubadorasSlice.actions;

export default incubadorasSlice.reducer;
