import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aAnimal } from '../services/animales'
import { conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'
import { ingresar, registrar, salir } from './usuarioSlice'

// Espeja FavoritoService del backend. items = los animales que guardó quien inició sesión.
// Se guardan en el backend, así que agregar y quitar son acciones asíncronas.

// Devuelve el animal que quedó guardado
export const agregarFavorito = createAsyncThunk('favoritos/agregarFavorito', async ({ token, idAnimal }) => {
  const { data } = await axios.put(`${URL_BASE}/favoritos/${idAnimal}`, null, conToken(token))
  return aAnimal(data.animal)
})

export const quitarFavorito = createAsyncThunk('favoritos/quitarFavorito', async ({ token, idAnimal }) => {
  await axios.delete(`${URL_BASE}/favoritos/${idAnimal}`, conToken(token))
  return idAnimal
})

const initialState = {
  items: [],
  loading: false,
  error: null,
}

// Los favoritos llegan con la sesión, al ingresar o registrarse
const conSesion = (state, action) => {
  state.items = action.payload.sesion.favoritos
}

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(agregarFavorito.pending, alEmpezar)
      .addCase(agregarFavorito.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(agregarFavorito.rejected, alFallar)

      .addCase(quitarFavorito.pending, alEmpezar)
      .addCase(quitarFavorito.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((guardado) => guardado.id !== action.payload)
      })
      .addCase(quitarFavorito.rejected, alFallar)

      // Acciones de usuarioSlice que también cambian los favoritos
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(salir, () => initialState)
  },
})

export default favoritosSlice.reducer
