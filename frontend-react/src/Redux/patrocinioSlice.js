import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aMiPatrocinio } from '../services/patrocinadores'
import { conToken, URL_BASE, conError } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Espeja la parte "mi patrocinio" de PatrocinadorService: el panel de la empresa logueada.
// Todas las acciones devuelven el panel completo (perfil, campañas e impacto), porque crear o terminar
// una campaña también cambia su nivel: el estado se reemplaza con lo que contesta el backend.


export const traerMiPatrocinio = createAsyncThunk('patrocinio/traerMiPatrocinio', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/patrocinadores/me`, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// datos = { descripcion, sitioWeb, icono, beneficio, cupon }
export const modificarMiPatrocinio = createAsyncThunk('patrocinio/modificarMiPatrocinio', async (datos, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/patrocinadores/me`, datos, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// { idAnimal, tope (en dólares), hasta: 'AAAA-MM-DD' }
export const crearCampania = createAsyncThunk('patrocinio/crearCampania', async ({ idAnimal, tope, hasta }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/patrocinadores/me/campanias`, { idAnimal, tope, fechaFin: hasta }, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// No la borra: la da por terminada (lo que ya duplicó sigue contando en el impacto)
export const finalizarCampania = createAsyncThunk('patrocinio/finalizarCampania', async (idCampania, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${URL_BASE}/patrocinadores/me/campanias/${idCampania}`, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  perfil: null, // null hasta que llega del backend
  campanias: [],
  impacto: { plata: 0, padrinos: 0, aportes: 0 },
  loading: false,
  error: null,
  errorAccion: null,
}

// Lo que contestó el backend reemplaza el panel entero
const conPanel = (state, action) => {
  state.loading = false
  state.perfil = action.payload.perfil
  state.campanias = action.payload.campanias
  state.impacto = action.payload.impacto
}

const patrocinioSlice = createSlice({
  name: 'patrocinio',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.errorAccion = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerMiPatrocinio.pending, alEmpezar)
      .addCase(traerMiPatrocinio.fulfilled, conPanel)
      .addCase(traerMiPatrocinio.rejected, alFallar)

      .addCase(modificarMiPatrocinio.pending, alEnviar)
      .addCase(modificarMiPatrocinio.fulfilled, conPanel)
      .addCase(modificarMiPatrocinio.rejected, alFallarEnvio)

      .addCase(crearCampania.pending, alEnviar)
      .addCase(crearCampania.fulfilled, conPanel)
      .addCase(crearCampania.rejected, alFallarEnvio)

      .addCase(finalizarCampania.pending, alEnviar)
      .addCase(finalizarCampania.fulfilled, conPanel)
      .addCase(finalizarCampania.rejected, alFallarEnvio)

      .addCase(salir, () => initialState)
  },
})

export const { limpiarError } = patrocinioSlice.actions

export default patrocinioSlice.reducer
