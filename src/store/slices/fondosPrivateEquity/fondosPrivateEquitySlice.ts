import { FondoPrivateEquity } from "../../../core/entities/fondosPrivateEquity.entity";
import { createListSlice } from "../createListSlice";

const fondosPrivateEquitySlice = createListSlice<
  FondoPrivateEquity,
  "fondosPrivateEquity"
>({
  name: "fondosPrivateEquity",
  itemsKey: "fondosPrivateEquity",
  fetchAction: "fetchFondosPrivateEquity",
});

export const { fetchFondosPrivateEquity, setLoading, setError } =
  fondosPrivateEquitySlice.actions;

export default fondosPrivateEquitySlice.reducer;
