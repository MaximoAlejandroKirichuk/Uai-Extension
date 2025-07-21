import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Crowfunding } from "../../../core/entities/crowfunding.entity";

interface CrowfundingState {
  crowfundings: Crowfunding[];
  loading: boolean;
  error: string | null;
}

const initialState: CrowfundingState = {
  crowfundings: [],
  loading: false,
  error: null,
};

const crowfundingSlice = createSlice({
  name: "crowfundings",
  initialState,
  reducers: {
    fetchCrowfundings(state, action: PayloadAction<Crowfunding[]>) {
      state.crowfundings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  fetchCrowfundings,
  setLoading,
  setError,
} = crowfundingSlice.actions;

export default crowfundingSlice.reducer;
