import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aPermiso, aRol } from '../services/usuarios'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Espeja RolService y PermisoService del backend (van juntos: un rol es su lista de permisos).
// Solo los puede usar un administrador. Rol: { id, nombre, permisos }. Permiso: { id, nombre, descripcion }.

export const traerRoles = createAsyncThunk('roles/traerRoles', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/roles`, conToken(getState))
    return comoLista(data).map(aRol)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const traerPermisos = createAsyncThunk('roles/traerPermisos', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/permisos`, conToken(getState))
    return comoLista(data).map(aPermiso)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const crearRol = createAsyncThunk('roles/crearRol', async (nombreRol, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/roles`, { nombreRol }, conToken(getState))
    return aRol(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const crearPermiso = createAsyncThunk('roles/crearPermiso', async ({ nombrePermiso, descripcion }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/permisos`, { nombrePermiso, descripcion }, conToken(getState))
    return aPermiso(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = createAsyncThunk('roles/asignarPermisos', async ({ idRol, idPermisos }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/roles/${idRol}/permisos`, { idPermisos }, conToken(getState))
    return aRol(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

const initialState = {
  items: [], // los roles
  permisos: [],
  loading: false,
  error: null,
  enviando: false,
  errorAccion: null,
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

      .addCase(traerPermisos.pending, alEmpezar)
      .addCase(traerPermisos.fulfilled, (state, action) => {
        state.loading = false
        state.permisos = action.payload
      })
      .addCase(traerPermisos.rejected, alFallar)

      .addCase(crearRol.pending, alEnviar)
      .addCase(crearRol.fulfilled, (state, action) => {
        state.enviando = false
        state.items = [...state.items, action.payload]
      })
      .addCase(crearRol.rejected, alFallarEnvio)

      .addCase(crearPermiso.pending, alEnviar)
      .addCase(crearPermiso.fulfilled, (state, action) => {
        state.enviando = false
        state.permisos = [...state.permisos, action.payload]
      })
      .addCase(crearPermiso.rejected, alFallarEnvio)

      .addCase(asignarPermisos.pending, alEnviar)
      .addCase(asignarPermisos.fulfilled, (state, action) => {
        state.enviando = false
        const index = state.items.findIndex((otro) => otro.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(asignarPermisos.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export default rolesSlice.reducer
