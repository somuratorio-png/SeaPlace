import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aBeneficio, aMiPatrocinio, aPatrocinador } from '../services/patrocinadores'
import { comoLista, conToken, URL_BASE, conError } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'

// Espeja PatrocinadorService del backend. Guarda tres cosas, cada una con su GET, su espera y su error:
// - las empresas que acompañan a SeaPlace ("Nos acompañan" en el inicio y la página para patrocinar).
// - los beneficios que ofrecen a los padrinos.
// - "mi patrocinio": el panel de la empresa logueada (miPerfil, misCampanias, miImpacto). Sus acciones
//   devuelven el panel completo, porque crear o terminar una campaña también cambia su nivel:
//   se reemplaza con lo que contesta el backend.

// ---------- Públicos ----------

// Del que más se comprometió al que menos
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

// ---------- Mi patrocinio (la empresa logueada) ----------

export const traerMiPatrocinio = createAsyncThunk('patrocinadores/traerMiPatrocinio', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/patrocinadores/me`, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// datos = { descripcion, sitioWeb, icono, beneficio, cupon }
export const modificarMiPatrocinio = createAsyncThunk('patrocinadores/modificarMiPatrocinio', async (datos, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/patrocinadores/me`, datos, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// { idAnimal, tope (en dólares), hasta: 'AAAA-MM-DD' }
export const crearCampania = createAsyncThunk('patrocinadores/crearCampania', async ({ idAnimal, tope, hasta }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/patrocinadores/me/campanias`, { idAnimal, tope, fechaFin: hasta }, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// No la borra: la da por terminada (lo que ya duplicó sigue contando en el impacto)
export const finalizarCampania = createAsyncThunk('patrocinadores/finalizarCampania', async (idCampania, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${URL_BASE}/patrocinadores/me/campanias/${idCampania}`, conToken(getState))
    return aMiPatrocinio(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// ---------- Slice ----------

const initialState = {
  patrocinadores: [],
  loading: false,
  error: null,
  beneficios: [],
  cargandoBeneficios: false,
  errorBeneficios: null,
  miPerfil: null, // null hasta que llega del backend
  misCampanias: [],
  miImpacto: { plata: 0, padrinos: 0, aportes: 0 },
  cargandoPanel: false,
  errorPanel: null,
  errorAccion: null,
}

// Lo que contestó el backend reemplaza el panel entero
const conPanel = (state, action) => {
  state.cargandoPanel = false
  state.miPerfil = action.payload.perfil
  state.misCampanias = action.payload.campanias
  state.miImpacto = action.payload.impacto
}

const patrocinadoresSlice = createSlice({
  name: 'patrocinadores',
  initialState,
  reducers: {
    limpiarError: (state) => {
      state.errorAccion = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerPatrocinadores.pending, alEmpezar)
      .addCase(traerPatrocinadores.fulfilled, (state, action) => {
        state.loading = false
        state.patrocinadores = action.payload
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

      .addCase(traerMiPatrocinio.pending, (state) => {
        state.cargandoPanel = true
        state.errorPanel = null
      })
      .addCase(traerMiPatrocinio.fulfilled, conPanel)
      .addCase(traerMiPatrocinio.rejected, (state, action) => {
        state.cargandoPanel = false
        state.errorPanel = action.payload ? action.payload.mensaje : action.error.message
      })

      .addCase(modificarMiPatrocinio.pending, alEnviar)
      .addCase(modificarMiPatrocinio.fulfilled, conPanel)
      .addCase(modificarMiPatrocinio.rejected, alFallarEnvio)

      .addCase(crearCampania.pending, alEnviar)
      .addCase(crearCampania.fulfilled, conPanel)
      .addCase(crearCampania.rejected, alFallarEnvio)

      .addCase(finalizarCampania.pending, alEnviar)
      .addCase(finalizarCampania.fulfilled, conPanel)
      .addCase(finalizarCampania.rejected, alFallarEnvio)

      // Los cupones y el panel son de quien estaba logueado: al salir se borran (la lista pública queda)
      .addCase(salir, (state) => ({
        ...initialState,
        patrocinadores: state.patrocinadores,
      }))
  },
})

export const { limpiarError } = patrocinadoresSlice.actions

export default patrocinadoresSlice.reducer
