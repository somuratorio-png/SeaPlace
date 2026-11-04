import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aCategoria } from '../services/animales'
import { comoLista, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja CategoriaService del backend. Cada categoría: { id, nombre, icono }

export const traerCategorias = createAsyncThunk('categorias/traerCategorias', async () => {
  const { data } = await axios.get(`${URL_BASE}/categorias`)
  return comoLista(data).map(aCategoria)
})

// Solo la puede crear un administrador
export const crearCategoria = createAsyncThunk('categorias/crearCategoria', async ({ token, nombreCategoria, descripcion }) => {
  const { data } = await axios.post(`${URL_BASE}/categorias`, { nombreCategoria, descripcion }, conToken(token))
  return aCategoria(data)
})

const initialState = {
  items: [],
  loading: false,
  error: null,
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

      .addCase(crearCategoria.pending, alEmpezar)
      .addCase(crearCategoria.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(crearCategoria.rejected, alFallar)
  },
})

export default categoriasSlice.reducer
