import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";

export type ListState<T, K extends string> = Record<K, T[]> & {
  loading: boolean;
  error: string | null;
};

interface CreateListSliceOptions<K extends string, A extends string> {
  name: string;
  itemsKey: K;
  fetchAction: A;
}

export const createListSlice = <
  T,
  K extends string,
  A extends string = string
>(
  options: CreateListSliceOptions<K, A>
) => {
  const initialState = {
    [options.itemsKey]: [],
    loading: false,
    error: null,
  } as ListState<T, K>;

  const fetchItems = createAction<T[]>(
    `${options.name}/${options.fetchAction}`
  );
  const setLoading = createAction<boolean>(`${options.name}/setLoading`);
  const setError = createAction<string | null>(`${options.name}/setError`);

  const reducer = createReducer(initialState, (builder) => {
    builder
      .addCase(fetchItems, (state, action) => {
        const current = state as ListState<T, K>;
        current[options.itemsKey] = action.payload as ListState<T, K>[K];
        current.loading = false;
        current.error = null;
      })
      .addCase(setLoading, (state, action) => {
        const current = state as ListState<T, K>;
        current.loading = action.payload;
      })
      .addCase(setError, (state, action) => {
        const current = state as ListState<T, K>;
        current.error = action.payload;
      });
  });

  const actions = {
    [options.fetchAction]: fetchItems,
    setLoading,
    setError,
  } as unknown as Record<A, ActionCreatorWithPayload<T[]>> & {
    setLoading: ActionCreatorWithPayload<boolean>;
    setError: ActionCreatorWithPayload<string | null>;
  };

  return {
    reducer,
    actions,
  };
};
