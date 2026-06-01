import { Universidad } from "../../../core/entities/universidad.entity";
import { createListSlice } from "../createListSlice";

const universidadesSlice = createListSlice<Universidad, "universidades">({
  name: "universidades",
  itemsKey: "universidades",
  fetchAction: "fetchUniversidades",
});

export const { fetchUniversidades, setLoading, setError } =
  universidadesSlice.actions;

export default universidadesSlice.reducer;
