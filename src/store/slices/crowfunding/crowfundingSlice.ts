import { Crowfunding } from "../../../core/entities/crowfunding.entity";
import { createListSlice } from "../createListSlice";

const crowfundingSlice = createListSlice<Crowfunding, "crowfundings">({
  name: "crowfundings",
  itemsKey: "crowfundings",
  fetchAction: "fetchCrowfundings",
});

export const { fetchCrowfundings, setLoading, setError } =
  crowfundingSlice.actions;

export default crowfundingSlice.reducer;
