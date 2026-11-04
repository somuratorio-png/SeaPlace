import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aNotificacion } from '../services/notificaciones'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja NotificacionService del backend. Cada una: { id, texto, fecha: 'AAAA-MM-DD', leida }

// Las de quien está logueado, de la más nueva a la más vieja
export const traerNotificaciones = createAsyncThunk('notificaciones/traerNotificaciones', async ({ token }) => {
  const { data } = await axios.get(`${URL_BASE}/notificaciones`, conToken(token))
  return comoLista(data).map(aNotificacion)
})

export const marcarLeidas = createAsyncThunk('notificaciones/marcarLeidas', async ({ token }) => {
  await axios.put(`${URL_BASE}/notificaciones/leidas`, null, conToken(token))
})

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerNotificaciones.pending, alEmpezar)
      .addCase(traerNotificaciones.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerNotificaciones.rejected, alFallar)

      .addCase(marcarLeidas.pending, alEmpezar)
      .addCase(marcarLeidas.fulfilled, (state) => {
        state.loading = false
        state.items = state.items.map((notificacion) => ({ ...notificacion, leida: true }))
      })
      .addCase(marcarLeidas.rejected, alFallar)
  },
})

export default notificacionesSlice.reducer
