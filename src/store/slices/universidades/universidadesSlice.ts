import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Universidad } from "../../../core/entities/universidad.entity";

interface UniversidadesState {
  universidades: Universidad[];
  loading: boolean;
  error: string | null;
}

const initialState: UniversidadesState = {
  universidades: [],
  loading: false,
  error: null,
};

const universidadesSlice = createSlice({
  name: "universidades",
  initialState,
  reducers: {
    fetchUniversidades(state, action: PayloadAction<Universidad[]>) {
      state.universidades = action.payload;
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
  fetchUniversidades,
  setLoading,
  setError,
} = universidadesSlice.actions;

export default universidadesSlice.reducer;
