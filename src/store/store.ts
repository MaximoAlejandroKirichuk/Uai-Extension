import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slices/user/userSlice'
import universidadReducer from './slices/universidades/universidadesSlice';
import crowfundingsReducer from './slices/crowfunding/crowfundingSlice';
import capitalVenturesReducer from './slices/capitalVentures/capitalVentures';
import plataformasReducer from './slices/plataforma/plataforma';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    universidades: universidadReducer,
    crowfundings : crowfundingsReducer,
    capitalVentures: capitalVenturesReducer,
    plataformas: plataformasReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch