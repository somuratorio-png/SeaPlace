import { configureStore } from '@reduxjs/toolkit'
import animalesReducer from './animalesSlice'
import apadrinamientosReducer from './apadrinamientosSlice'
import categoriasReducer from './categoriasSlice'
import comentariosReducer from './comentariosSlice'
import favoritosReducer from './favoritosSlice'
import muelleReducer from './muelleSlice'
import notificacionesReducer from './notificacionesSlice'
import planesReducer from './planesSlice'
import rolesReducer from './rolesSlice'
import usuarioReducer from './usuarioSlice'
import usuariosReducer from './usuariosSlice'

// El estado global de la app. Cada clave tiene el mismo nombre que el "name" de su slice,
// así lo que se ve en Redux DevTools coincide con lo que se lee con useSelector((state) => state.animales).
export const store = configureStore({
  reducer: {
    animales: animalesReducer,
    categorias: categoriasReducer,
    planes: planesReducer,
    muelle: muelleReducer,
    apadrinamientos: apadrinamientosReducer,
    favoritos: favoritosReducer,
    notificaciones: notificacionesReducer,
    comentarios: comentariosReducer,
    usuario: usuarioReducer,
    usuarios: usuariosReducer,
    roles: rolesReducer,
  },
})
