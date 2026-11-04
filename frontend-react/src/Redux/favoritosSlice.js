import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aAnimal } from '../services/animales'
import { conToken, URL_BASE } from './api'
import { alEnviar, alFallarEnvio } from './casos'
import { ingresar, registrar, salir } from './usuarioSlice'

// Espeja FavoritoService del backend. items = los animales que guardó quien inició sesión.
// No hay un GET propio: llegan con la sesión, al ingresar o registrarse.

// Devuelve el animal que quedó guardado
export const agregarFavorito = createAsyncThunk('favoritos/agregarFavorito', async (idAnimal, { getState }) => {
  const { data } = await axios.put(`${URL_BASE}/favoritos/${idAnimal}`, null, conToken(getState))
  return aAnimal(data.animal)
})

export const quitarFavorito = createAsyncThunk('favoritos/quitarFavorito', async (idAnimal, { getState }) => {
  await axios.delete(`${URL_BASE}/favoritos/${idAnimal}`, conToken(getState))
  return idAnimal
})

const initialState = {
  items: [],
  enviando: false,
  errorAccion: null,
}

const conSesion = (state, action) => {
  state.items = action.payload.sesion.favoritos
}

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(agregarFavorito.pending, alEnviar)
      .addCase(agregarFavorito.fulfilled, (state, action) => {
        state.enviando = false
        state.items.push(action.payload)
      })
      .addCase(agregarFavorito.rejected, alFallarEnvio)

      .addCase(quitarFavorito.pending, alEnviar)
      .addCase(quitarFavorito.fulfilled, (state, action) => {
        state.enviando = false
        state.items = state.items.filter((guardado) => guardado.id !== action.payload)
      })
      .addCase(quitarFavorito.rejected, alFallarEnvio)

      // Acciones de usuarioSlice que también cambian los favoritos
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(salir, () => initialState)
  },
})

export default favoritosSlice.reducer
