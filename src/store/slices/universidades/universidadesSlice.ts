import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, onValue } from "firebase/database";
import { Universidad } from "../../../core/entities/universidad.entity";
import { database } from "../../../firebase/firebaseConfig";

interface EstadoUniversidades {
  universidades: Universidad[];
  loading: boolean;
  error: string | null;
}

const initialState: EstadoUniversidades = {
  universidades: [],
  loading: false,
  error: null,
};

export const fetchUniversidades = createAsyncThunk(
  "universidades/fetch",
  async (_, { rejectWithValue }) => {
    return new Promise<Universidad[]>((resolve, reject) => {
      const universidadesRef = ref(database, "universidades");

      onValue(
        universidadesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const universidadesArray: Universidad[] = Object.entries(data).map(
              ([id, uni]) => ({
                ...(uni as Universidad),
                id, 
              })
            );
            resolve(universidadesArray);
          } else {
            resolve([]);
          }
        },
        (error) => rejectWithValue(error.message)
      );
    });
  }
);


export const universidadesSlice = createSlice({
  name: "universidades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversidades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUniversidades.fulfilled, (state, action) => {
        state.loading = false;
        state.universidades = action.payload;
      })
      .addCase(fetchUniversidades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default universidadesSlice.reducer;
