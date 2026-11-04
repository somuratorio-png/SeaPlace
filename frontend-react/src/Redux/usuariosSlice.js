import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aUsuario } from '../services/usuarios'
import { comoPagina, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// La administración de cuentas: espeja la parte de administrador de UsuarioService y RefugioService.
// Solo las puede usar un administrador. (Quién inició sesión vive en usuarioSlice.)

export const traerUsuarios = createAsyncThunk('usuarios/traerUsuarios', async ({ token }) => {
  const { data } = await axios.get(`${URL_BASE}/usuarios`, conToken(token))
  return comoPagina(data).map(aUsuario)
})

export const cambiarRol = createAsyncThunk('usuarios/cambiarRol', async ({ token, idUsuario, idRol }) => {
  const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/rol`, { idRol }, conToken(token))
  return aUsuario(data)
})

// No borra al usuario: lo deja inactivo
export const darDeBaja = createAsyncThunk('usuarios/darDeBaja', async ({ token, idUsuario }) => {
  const { data } = await axios.delete(`${URL_BASE}/usuarios/${idUsuario}`, conToken(token))
  return aUsuario(data)
})

export const reactivar = createAsyncThunk('usuarios/reactivar', async ({ token, idUsuario }) => {
  const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/reactivar`, null, conToken(token))
  return aUsuario(data)
})

export const aprobarRefugio = createAsyncThunk('usuarios/aprobarRefugio', async ({ token, idRefugio }) => {
  await axios.put(`${URL_BASE}/refugios/${idRefugio}/aprobar`, null, conToken(token))
  return idRefugio
})

const initialState = {
  items: [],
  loading: false,
  error: null,
}

// Las que devuelven el usuario modificado: se lo reemplaza en la lista
const conUsuarioModificado = (state, action) => {
  state.loading = false
  state.items = state.items.map((otro) => (otro.id === action.payload.id ? action.payload : otro))
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

      .addCase(cambiarRol.pending, alEmpezar)
      .addCase(cambiarRol.fulfilled, conUsuarioModificado)
      .addCase(cambiarRol.rejected, alFallar)

      .addCase(darDeBaja.pending, alEmpezar)
      .addCase(darDeBaja.fulfilled, conUsuarioModificado)
      .addCase(darDeBaja.rejected, alFallar)

      .addCase(reactivar.pending, alEmpezar)
      .addCase(reactivar.fulfilled, conUsuarioModificado)
      .addCase(reactivar.rejected, alFallar)

      // El dueño de ese refugio deja de estar pendiente
      .addCase(aprobarRefugio.pending, alEmpezar)
      .addCase(aprobarRefugio.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.map((usuario) => (usuario.idRefugio === action.payload ? { ...usuario, aprobado: true } : usuario))
      })
      .addCase(aprobarRefugio.rejected, alFallar)
  },
})

export default usuariosSlice.reducer
