import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aPermiso, aRol } from '../services/usuarios'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja RolService y PermisoService del backend (van juntos: un rol es su lista de permisos).
// Solo los puede usar un administrador. Rol: { id, nombre, permisos }. Permiso: { id, nombre, descripcion }.

export const traerRoles = createAsyncThunk('roles/traerRoles', async ({ token }) => {
  const { data } = await axios.get(`${URL_BASE}/roles`, conToken(token))
  return comoLista(data).map(aRol)
})

export const crearRol = createAsyncThunk('roles/crearRol', async ({ token, nombreRol }) => {
  const { data } = await axios.post(`${URL_BASE}/roles`, { nombreRol }, conToken(token))
  return aRol(data)
})

export const traerPermisos = createAsyncThunk('roles/traerPermisos', async ({ token }) => {
  const { data } = await axios.get(`${URL_BASE}/permisos`, conToken(token))
  return comoLista(data).map(aPermiso)
})

export const crearPermiso = createAsyncThunk('roles/crearPermiso', async ({ token, nombrePermiso, descripcion }) => {
  const { data } = await axios.post(`${URL_BASE}/permisos`, { nombrePermiso, descripcion }, conToken(token))
  return aPermiso(data)
})

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = createAsyncThunk('roles/asignarPermisos', async ({ token, idRol, idPermisos }) => {
  const { data } = await axios.post(`${URL_BASE}/roles/${idRol}/permisos`, { idPermisos }, conToken(token))
  return aRol(data)
})

const initialState = {
  items: [], // los roles
  permisos: [],
  loading: false,
  error: null,
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerRoles.pending, alEmpezar)
      .addCase(traerRoles.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerRoles.rejected, alFallar)

      .addCase(crearRol.pending, alEmpezar)
      .addCase(crearRol.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(crearRol.rejected, alFallar)

      .addCase(traerPermisos.pending, alEmpezar)
      .addCase(traerPermisos.fulfilled, (state, action) => {
        state.loading = false
        state.permisos = action.payload
      })
      .addCase(traerPermisos.rejected, alFallar)

      .addCase(crearPermiso.pending, alEmpezar)
      .addCase(crearPermiso.fulfilled, (state, action) => {
        state.loading = false
        state.permisos.push(action.payload)
      })
      .addCase(crearPermiso.rejected, alFallar)

      .addCase(asignarPermisos.pending, alEmpezar)
      .addCase(asignarPermisos.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((otro) => (otro.id === action.payload.id ? action.payload : otro))
      })
      .addCase(asignarPermisos.rejected, alFallar)
  },
})

export default rolesSlice.reducer
