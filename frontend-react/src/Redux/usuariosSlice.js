import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aUsuario } from '../services/usuarios'
import { comoPagina, conToken, URL_BASE, conError } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// La administración de cuentas: espeja la parte de administrador de UsuarioService y RefugioService.
// Solo las puede usar un administrador. (Quién inició sesión vive en usuarioSlice.)

export const traerUsuarios = createAsyncThunk('usuarios/traerUsuarios', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/usuarios`, conToken(getState))
    return comoPagina(data).map(aUsuario)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado
export const cambiarRol = createAsyncThunk('usuarios/cambiarRol', async ({ idUsuario, idRol }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/rol`, { idRol }, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// No borra al usuario: lo deja inactivo. Si es un refugio, el backend pausa sus publicaciones (ver animalesSlice).
export const darDeBaja = createAsyncThunk('usuarios/darDeBaja', async (idUsuario, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${URL_BASE}/usuarios/${idUsuario}`, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const reactivar = createAsyncThunk('usuarios/reactivar', async (idUsuario, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/reactivar`, null, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const aprobarRefugio = createAsyncThunk('usuarios/aprobarRefugio', async (idRefugio, { getState, rejectWithValue }) => {
  try {
    await axios.put(`${URL_BASE}/refugios/${idRefugio}/aprobar`, null, conToken(getState))
    return idRefugio
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null,
  errorAccion: null,
}

// Las que devuelven el usuario modificado: se lo reemplaza en la lista
const conUsuarioModificado = (state, action) => {
  const index = state.items.findIndex((otro) => otro.id === action.payload.id)
  if (index !== -1) {
    state.items[index] = action.payload
  }
}

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerUsuarios.pending, alEmpezar)
      .addCase(traerUsuarios.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerUsuarios.rejected, alFallar)

      .addCase(cambiarRol.pending, alEnviar)
      .addCase(cambiarRol.fulfilled, conUsuarioModificado)
      .addCase(cambiarRol.rejected, alFallarEnvio)

      .addCase(darDeBaja.pending, alEnviar)
      .addCase(darDeBaja.fulfilled, conUsuarioModificado)
      .addCase(darDeBaja.rejected, alFallarEnvio)

      .addCase(reactivar.pending, alEnviar)
      .addCase(reactivar.fulfilled, conUsuarioModificado)
      .addCase(reactivar.rejected, alFallarEnvio)

      // El dueño de ese refugio deja de estar pendiente
      .addCase(aprobarRefugio.pending, alEnviar)
      .addCase(aprobarRefugio.fulfilled, (state, action) => {
        const index = state.items.findIndex((usuario) => usuario.idRefugio === action.payload)
        if (index !== -1) {
          state.items[index] = { ...state.items[index], aprobado: true }
        }
      })
      .addCase(aprobarRefugio.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export default usuariosSlice.reducer
