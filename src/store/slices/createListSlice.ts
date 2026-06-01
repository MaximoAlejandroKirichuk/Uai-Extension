import { createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";

export type ListState<T, K extends string> = Record<K, T[]> & {
  loading: boolean;
  error: string | null;
};

interface CreateListSliceOptions<T, K extends string> {
  name: string;
  itemsKey: K;
  fetchAction: string;
}

export const createListSlice = <T, K extends string>(
  options: CreateListSliceOptions<T, K>
) => {
  const initialState = {
    [options.itemsKey]: [],
    loading: false,
    error: null,
  } as ListState<T, K>;

  const reducers = {
    [options.fetchAction]: (
      state: ListState<T, K>,
      action: PayloadAction<T[]>
    ) => {
      state[options.itemsKey] = action.payload as ListState<T, K>[K];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state: ListState<T, K>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (
      state: ListState<T, K>,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
    },
  } as SliceCaseReducers<ListState<T, K>>;

  return createSlice({
    name: options.name,
    initialState,
    reducers,
  });
};
