import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aCampania } from '../services/patrocinadores'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Las campañas de duplicación vistas desde el refugio: las que le proponen los patrocinadores para sus
// animales. Las pendientes las acepta (desde ese día se duplican los aportes) o las rechaza.
// (Las del patrocinador, desde su lado, están en patrocinioSlice.)

const conError = (error) => (error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })

// Las de los animales del refugio logueado, de la más nueva a la más vieja
export const traerCampanias = createAsyncThunk('campanias/traerCampanias', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/campanias`, conToken(getState))
    return comoLista(data).map(aCampania)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const aceptarCampania = createAsyncThunk('campanias/aceptarCampania', async (idCampania, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/campanias/${idCampania}/aceptar`, null, conToken(getState))
    return aCampania(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// El motivo es opcional: le llega al patrocinador en la notificación
export const rechazarCampania = createAsyncThunk('campanias/rechazarCampania', async ({ idCampania, motivo }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/campanias/${idCampania}/rechazar`, { motivo }, conToken(getState))
    return aCampania(data)
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

// Aceptar y rechazar devuelven la campaña como quedó: se la reemplaza en la lista
const conCampaniaModificada = (state, action) => {
  const index = state.items.findIndex((campania) => campania.id === action.payload.id)
  if (index !== -1) {
    state.items[index] = action.payload
  }
}

const campaniasSlice = createSlice({
  name: 'campanias',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.errorAccion = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerCampanias.pending, alEmpezar)
      .addCase(traerCampanias.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerCampanias.rejected, alFallar)

      .addCase(aceptarCampania.pending, alEnviar)
      .addCase(aceptarCampania.fulfilled, conCampaniaModificada)
      .addCase(aceptarCampania.rejected, alFallarEnvio)

      .addCase(rechazarCampania.pending, alEnviar)
      .addCase(rechazarCampania.fulfilled, conCampaniaModificada)
      .addCase(rechazarCampania.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export const { limpiarError } = campaniasSlice.actions

export default campaniasSlice.reducer
