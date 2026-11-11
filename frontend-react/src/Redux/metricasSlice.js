import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { conToken, URL_BASE, conError } from './api'
import { alEmpezar, alFallar } from './casos'
import { salir } from './usuarioSlice'

// Espeja MetricasService del backend: las métricas comerciales del panel del administrador.
// Montos en dólares. ingresosPorMes = los últimos 6 meses, del más viejo al más nuevo: { mes: 'AAAA-MM', padrinos, patrocinadores, pagos }.

const aMetricas = (dato) => ({
  recurrente: dato.ingresoMensualRecurrente,
  apadrinamientosActivos: dato.apadrinamientosActivos,
  padrinosActivos: dato.padrinosActivos,
  porPadrino: dato.ingresoPorPadrino,
  pagos: dato.pagos,
  ticketPromedio: dato.ticketPromedio,
  bajas: dato.bajasUltimoMes,
  tasaDeBajas: dato.tasaDeBajas,
  conversion: dato.conversion,
  muellesAbandonados: dato.muellesAbandonados,
  aportePadrinos: dato.aportePadrinos,
  aportePatrocinadores: dato.aportePatrocinadores,
  patrocinadores: dato.patrocinadores,
  campaniasVigentes: dato.campaniasVigentes,
  meses: dato.ingresosPorMes,
})

export const traerMetricas = createAsyncThunk('metricas/traerMetricas', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/metricas`, conToken(getState))
    return aMetricas(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  datos: null, // null hasta que llegan del backend
  loading: false,
  error: null,
}

const metricasSlice = createSlice({
  name: 'metricas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerMetricas.pending, alEmpezar)
      .addCase(traerMetricas.fulfilled, (state, action) => {
        state.loading = false
        state.datos = action.payload
      })
      .addCase(traerMetricas.rejected, alFallar)

      .addCase(salir, () => initialState)
  },
})

export default metricasSlice.reducer
