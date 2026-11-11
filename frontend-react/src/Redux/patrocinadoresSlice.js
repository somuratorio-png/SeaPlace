import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aBeneficio, aPatrocinador } from '../services/patrocinadores'
import { comoLista, conToken, URL_BASE, conError } from './api'
import { alEmpezar, alFallar } from './casos'
import { salir } from './usuarioSlice'

// Espeja la parte pública de PatrocinadorService: las empresas que acompañan a SeaPlace
// ("Nos acompañan" en el inicio y la página para patrocinar) y los beneficios que ofrecen a los padrinos.
// Son dos listados distintos, cada uno con su GET, su espera y su error.

// Públicos: del que más se comprometió al que menos
export const traerPatrocinadores = createAsyncThunk('patrocinadores/traerPatrocinadores', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/patrocinadores`)
    return comoLista(data).map(aPatrocinador)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Con su cupón: solo para quien apadrina hoy algún animal
export const traerBeneficios = createAsyncThunk('patrocinadores/traerBeneficios', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/patrocinadores/beneficios`, conToken(getState))
    return comoLista(data).map(aBeneficio)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null,
  beneficios: [],
  cargandoBeneficios: false,
  errorBeneficios: null,
}

const patrocinadoresSlice = createSlice({
  name: 'patrocinadores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerPatrocinadores.pending, alEmpezar)
      .addCase(traerPatrocinadores.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerPatrocinadores.rejected, alFallar)

      .addCase(traerBeneficios.pending, (state) => {
        state.cargandoBeneficios = true
        state.errorBeneficios = null
      })
      .addCase(traerBeneficios.fulfilled, (state, action) => {
        state.cargandoBeneficios = false
        state.beneficios = action.payload
      })
      .addCase(traerBeneficios.rejected, (state, action) => {
        state.cargandoBeneficios = false
        state.errorBeneficios = action.payload ? action.payload.mensaje : action.error.message
      })

      // Los cupones son de quien estaba logueado: al salir se borran
      .addCase(salir, (state) => {
        state.beneficios = []
        state.errorBeneficios = null
      })
  },
})

export default patrocinadoresSlice.reducer
