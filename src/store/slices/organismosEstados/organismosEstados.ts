import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrganismoEstado } from "../../../core/entities/organismosEstado.entity";


interface OrganismosState {
  organismos: OrganismoEstado[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganismosState = {
  organismos: [],
  loading: false,
  error: null,
};

const organismosSlice = createSlice({
  name: "organismos",
  initialState,
  reducers: {
    fetchOrganismos(state, action: PayloadAction<OrganismoEstado[]>) {
      state.organismos = action.payload;
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

export const { fetchOrganismos, setLoading, setError } = organismosSlice.actions;
export default organismosSlice.reducer;
