import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './slices/user/userSlice'
import universidadReducer from './slices/universidades/universidadesSlice';
import crowfundingsReducer from './slices/crowfunding/crowfundingSlice';
import capitalVenturesReducer from './slices/capitalVentures/capitalVentures';
import plataformasReducer from './slices/plataforma/plataforma';
import organismosReducer  from './slices/organismosEstados/organismosEstados';
import incubadorasReducer from './slices/incubadoras/incubadorasSlice';
import fondosPrivateEquityReducer from './slices/fondosPrivateEquity/fondosPrivateEquitySlice';
import proveedoresServiciosReducer from './slices/proveedoresServicios/proveedoresServiciosSlice';
import apoyoEmprendedorReducer from './slices/apoyoEmprendedor/apoyoEmprendedorSlice';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    universidades: universidadReducer,
    crowfundings : crowfundingsReducer,
    capitalVentures: capitalVenturesReducer,
    plataformas: plataformasReducer,
    organismos: organismosReducer,
    incubadoras: incubadorasReducer,
    fondosPrivateEquity: fondosPrivateEquityReducer,
    proveedoresServicios: proveedoresServiciosReducer,
    apoyoEmprendedor: apoyoEmprendedorReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
