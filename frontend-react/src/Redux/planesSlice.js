import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aPlanes } from '../services/apadrinar'
import { URL_BASE, conError } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja PlanService del backend. Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
// Llegan con el pedido inicial (/inicio), que se hace una sola vez al abrir la página.

export const traerPlanes = createAsyncThunk('planes/traerPlanes', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/inicio`)
    return aPlanes(data.planes)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const planesSlice = createSlice({
  name: 'planes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerPlanes.pending, alEmpezar)
      .addCase(traerPlanes.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerPlanes.rejected, alFallar)
  },
})

export default planesSlice.reducer
