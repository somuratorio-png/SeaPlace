import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aCategoria } from '../services/animales'
import { comoLista, conToken, URL_BASE, conError } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'

// Espeja CategoriaService del backend. Cada categoría: { id, nombre, icono }

export const traerCategorias = createAsyncThunk('categorias/traerCategorias', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/categorias`)
    return comoLista(data).map(aCategoria)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Solo la puede crear un administrador
export const crearCategoria = createAsyncThunk('categorias/crearCategoria', async ({ nombreCategoria, descripcion }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/categorias`, { nombreCategoria, descripcion }, conToken(getState))
    return aCategoria(data)
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

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(traerCategorias.pending, alEmpezar)
      .addCase(traerCategorias.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerCategorias.rejected, alFallar)

      .addCase(crearCategoria.pending, alEnviar)
      .addCase(crearCategoria.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload]
      })
      .addCase(crearCategoria.rejected, alFallarEnvio)
  },
})

export default categoriasSlice.reducer
