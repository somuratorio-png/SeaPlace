import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aApadrinamiento } from '../services/apadrinar'
import { aComentario } from '../services/comentarios'
import { comoLista, conToken, planesDe, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Espeja ApadrinamientoService del backend. Cada apadrinamiento trae su animal, su plan, los pagos,
// la bitácora y la última ubicación (ver aApadrinamiento). Los planes hacen falta para armar el plan completo.

// Los que le corresponden a quien está logueado: un padrino recibe los suyos (también los cancelados,
// para el historial), un refugio los de sus animales y un administrador todos
export const traerApadrinamientos = createAsyncThunk('apadrinamientos/traerApadrinamientos', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/apadrinamientos`, conToken(getState))
    return comoLista(data).map((dato) => aApadrinamiento(planesDe(getState), dato))
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const cambiarPlan = createAsyncThunk('apadrinamientos/cambiarPlan', async ({ idApadrinamiento, codigoPlan }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/apadrinamientos/${idApadrinamiento}/plan`, { plan: codigoPlan }, conToken(getState))
    return aApadrinamiento(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// No lo borra: queda inactivo y sus cupos vuelven a estar disponibles
export const cancelarApadrinamiento = createAsyncThunk('apadrinamientos/cancelarApadrinamiento', async (idApadrinamiento, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${URL_BASE}/apadrinamientos/${idApadrinamiento}`, conToken(getState))
    return aApadrinamiento(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Comentar una novedad de la bitácora: solo sus padrinos de hoy y su refugio. Devuelve el comentario nuevo.
export const comentarNovedad = createAsyncThunk('apadrinamientos/comentarNovedad', async ({ idAnimal, idNovedad, texto }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/animales/${idAnimal}/novedades/${idNovedad}/comentarios`, { texto }, conToken(getState))
    return aComentario(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Solo quien lo escribió o un administrador. Devuelve dónde estaba, para sacarlo de su novedad.
export const borrarComentarioNovedad = createAsyncThunk('apadrinamientos/borrarComentarioNovedad', async ({ idNovedad, idComentario }, { getState, rejectWithValue }) => {
  try {
    await axios.delete(`${URL_BASE}/comentarios/${idComentario}`, conToken(getState))
    return { idNovedad, idComentario }
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

// Las que devuelven el apadrinamiento como quedó: se lo reemplaza en la lista
const conApadrinamientoModificado = (state, action) => {
  const index = state.items.findIndex((otro) => otro.id === action.payload.id)
  if (index !== -1) {
    state.items[index] = action.payload
  }
}

// Cambia los comentarios de una novedad en todos los apadrinamientos que la traen
// (la misma novedad aparece en cada apadrinamiento de ese animal, también en los cancelados)
const cambiarComentarios = (state, idNovedad, cambiar) => {
  state.items = state.items.map((item) => ({
    ...item,
    novedades: item.novedades.map((novedad) => (novedad.id === idNovedad ? { ...novedad, comentarios: cambiar(novedad.comentarios) } : novedad)),
  }))
}

const apadrinamientosSlice = createSlice({
  name: 'apadrinamientos',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.errorAccion = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerApadrinamientos.pending, alEmpezar)
      .addCase(traerApadrinamientos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerApadrinamientos.rejected, alFallar)

      .addCase(cambiarPlan.pending, alEnviar)
      .addCase(cambiarPlan.fulfilled, conApadrinamientoModificado)
      .addCase(cambiarPlan.rejected, alFallarEnvio)

      .addCase(cancelarApadrinamiento.pending, alEnviar)
      .addCase(cancelarApadrinamiento.fulfilled, conApadrinamientoModificado)
      .addCase(cancelarApadrinamiento.rejected, alFallarEnvio)

      // La conversación va de la más vieja a la más nueva: el comentario nuevo queda al final
      .addCase(comentarNovedad.pending, alEnviar)
      .addCase(comentarNovedad.fulfilled, (state, action) => {
        cambiarComentarios(state, action.payload.idNovedad, (comentarios) => [...comentarios, action.payload])
      })
      .addCase(comentarNovedad.rejected, alFallarEnvio)

      .addCase(borrarComentarioNovedad.pending, alEnviar)
      .addCase(borrarComentarioNovedad.fulfilled, (state, action) => {
        const { idNovedad, idComentario } = action.payload
        cambiarComentarios(state, idNovedad, (comentarios) => comentarios.filter((comentario) => comentario.id !== idComentario))
      })
      .addCase(borrarComentarioNovedad.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export const { limpiarError } = apadrinamientosSlice.actions

export default apadrinamientosSlice.reducer
