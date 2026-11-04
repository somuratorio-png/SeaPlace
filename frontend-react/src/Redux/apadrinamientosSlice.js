import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aApadrinamiento } from '../services/apadrinar'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja ApadrinamientoService del backend. Cada apadrinamiento trae su animal, su plan, los pagos,
// la bitácora y la última ubicación (ver aApadrinamiento). "planes" hacen falta para armar el plan completo.

// Los que le corresponden a quien está logueado: un padrino recibe los suyos, un refugio los de sus animales y un administrador todos
export const traerApadrinamientos = createAsyncThunk('apadrinamientos/traerApadrinamientos', async ({ token, planes }) => {
  const { data } = await axios.get(`${URL_BASE}/apadrinamientos`, conToken(token))
  return comoLista(data).map((dato) => aApadrinamiento(planes, dato))
})

export const cambiarPlan = createAsyncThunk('apadrinamientos/cambiarPlan', async ({ token, planes, idApadrinamiento, codigoPlan }) => {
  const { data } = await axios.put(`${URL_BASE}/apadrinamientos/${idApadrinamiento}/plan`, { plan: codigoPlan }, conToken(token))
  return aApadrinamiento(planes, data)
})

// No lo borra: queda inactivo y sus cupos vuelven a estar disponibles
export const cancelarApadrinamiento = createAsyncThunk('apadrinamientos/cancelarApadrinamiento', async ({ token, planes, idApadrinamiento }) => {
  const { data } = await axios.delete(`${URL_BASE}/apadrinamientos/${idApadrinamiento}`, conToken(token))
  return aApadrinamiento(planes, data)
})

const initialState = {
  items: [],
  loading: false,
  error: null,
}

// Las que devuelven el apadrinamiento como quedó: se lo reemplaza en la lista
const conApadrinamientoModificado = (state, action) => {
  state.loading = false
  state.items = state.items.map((otro) => (otro.id === action.payload.id ? action.payload : otro))
}

const apadrinamientosSlice = createSlice({
  name: 'apadrinamientos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerApadrinamientos.pending, alEmpezar)
      .addCase(traerApadrinamientos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerApadrinamientos.rejected, alFallar)

      .addCase(cambiarPlan.pending, alEmpezar)
      .addCase(cambiarPlan.fulfilled, conApadrinamientoModificado)
      .addCase(cambiarPlan.rejected, alFallar)

      .addCase(cancelarApadrinamiento.pending, alEmpezar)
      .addCase(cancelarApadrinamiento.fulfilled, conApadrinamientoModificado)
      .addCase(cancelarApadrinamiento.rejected, alFallar)
  },
})

export default apadrinamientosSlice.reducer
