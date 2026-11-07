import{ createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aComentario } from '../services/comentarios'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'

// Espeja la parte "página" de ComentarioService del backend: los comentarios que cualquiera ve en el inicio.
// Los de las novedades de la bitácora viajan dentro de cada apadrinamiento (ver apadrinamientosSlice).

// Públicos: no hace falta haber iniciado sesión. Del más nuevo al más viejo.
export const traerComentarios = createAsyncThunk('comentarios/traerComentarios', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/comentarios`)
    return comoLista(data).map(aComentario)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const comentar = createAsyncThunk('comentarios/comentar', async (texto, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/comentarios`, { texto }, conToken(getState))
    return aComentario(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Solo quien lo escribió o un administrador. Devuelve el id para sacarlo de la lista.
export const borrarComentario = createAsyncThunk('comentarios/borrarComentario', async (idComentario, { getState, rejectWithValue }) => {
  try {
    await axios.delete(`${URL_BASE}/comentarios/${idComentario}`, conToken(getState))
    return idComentario
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null,
  errorAccion: null,
}

const comentariosSlice = createSlice({
  name: 'comentarios',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.errorAccion = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerComentarios.pending, alEmpezar)
      .addCase(traerComentarios.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerComentarios.rejected, alFallar)

      // El nuevo va primero: la lista está ordenada del más nuevo al más viejo
      .addCase(comentar.pending, alEnviar)
      .addCase(comentar.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]
      })
      .addCase(comentar.rejected, alFallarEnvio)

      .addCase(borrarComentario.pending, alEnviar)
      .addCase(borrarComentario.fulfilled, (state, action) => {
        state.items = state.items.filter((comentario) => comentario.id !== action.payload)
      })
      .addCase(borrarComentario.rejected, alFallarEnvio)
  },
})

export const { limpiarError } = comentariosSlice.actions

export default comentariosSlice.reducer
