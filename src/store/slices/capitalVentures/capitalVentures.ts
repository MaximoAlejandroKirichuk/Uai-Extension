import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CapitalVentures } from "../../../core/entities/capitalVentures.entity";

interface CapitalVenturesState {
  capitalVentures: CapitalVentures[];
  loading: boolean;
  error: string | null;
}

const initialState: CapitalVenturesState = {
  capitalVentures: [],
  loading: false,
  error: null,
};

const crowfundingSlice = createSlice({
  name: "capitalVentures",
  initialState,
  reducers: {
    fetchCapitalVentures(state, action: PayloadAction<CapitalVentures[]>) {
      state.capitalVentures = action.payload;
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
  fetchCapitalVentures,
  setLoading,
  setError,
} = crowfundingSlice.actions;

export default crowfundingSlice.reducer;
