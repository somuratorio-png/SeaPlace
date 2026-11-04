import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aNotificacion } from '../services/notificaciones'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Espeja NotificacionService del backend. Cada una: { id, texto, fecha: 'AAAA-MM-DD', leida }.
// Las comparten la campanita del header y el panel del refugio: al leerlas en un lado, el número baja en los dos.

// Las de quien está logueado, de la más nueva a la más vieja
export const traerNotificaciones = createAsyncThunk('notificaciones/traerNotificaciones', async (_, { getState }) => {
  const { data } = await axios.get(`${URL_BASE}/notificaciones`, conToken(getState))
  return comoLista(data).map(aNotificacion)
})

export const marcarLeidas = createAsyncThunk('notificaciones/marcarLeidas', async (_, { getState }) => {
  await axios.put(`${URL_BASE}/notificaciones/leidas`, null, conToken(getState))
})

const initialState = {
  items: [],
  loading: false,
  error: null,
  enviando: false,
  errorAccion: null,
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

      // Las que recién se marcaron quedan con nueva: true, para seguir resaltándolas mientras se miran
      .addCase(marcarLeidas.pending, alEnviar)
      .addCase(marcarLeidas.fulfilled, (state) => {
        state.enviando = false
        state.items = state.items.map((notificacion) => ({ ...notificacion, nueva: !notificacion.leida, leida: true }))
      })
      .addCase(marcarLeidas.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export default notificacionesSlice.reducer
