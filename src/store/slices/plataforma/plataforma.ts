import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plataforma } from "../../../core/entities/plataformas.entity";

interface PlataformaState {
  plataformas: Plataforma[];
  loading: boolean;
  error: string | null;
}

const initialState: PlataformaState = {
  plataformas: [],
  loading: false,
  error: null,
};

const PlataformaSlice = createSlice({
  name: "plataformas",
  initialState,
  reducers: {
    fetchPlataformas(state, action: PayloadAction<Plataforma[]>) {
      state.plataformas = action.payload;
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
  fetchPlataformas,
  setLoading,
  setError,
} = PlataformaSlice.actions;

export default PlataformaSlice.reducer;
