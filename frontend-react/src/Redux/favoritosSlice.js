import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aAnimal } from '../services/animales'
import { conToken, URL_BASE, conError } from './api'
import { alEnviar, alFallarEnvio } from './casos'
import { ingresar, registrar, salir } from './usuarioSlice'

// Espeja FavoritoService del backend. favoritos = los animales que guardó quien inició sesión.
// No hay un GET propio: llegan con la sesión, al ingresar o registrarse.

// Devuelve el animal que quedó guardado
export const agregarFavorito = createAsyncThunk('favoritos/agregarFavorito', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/favoritos/${idAnimal}`, null, conToken(getState))
    return aAnimal(data.animal)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const quitarFavorito = createAsyncThunk('favoritos/quitarFavorito', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    await axios.delete(`${URL_BASE}/favoritos/${idAnimal}`, conToken(getState))
    return idAnimal
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

const initialState = {
  favoritos: [],
  errorAccion: null,
}

const conSesion = (state, action) => {
  state.favoritos = action.payload.sesion.favoritos
}

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(agregarFavorito.pending, alEnviar)
      .addCase(agregarFavorito.fulfilled, (state, action) => {
        state.favoritos = [...state.favoritos, action.payload]
      })
      .addCase(agregarFavorito.rejected, alFallarEnvio)

      .addCase(quitarFavorito.pending, alEnviar)
      .addCase(quitarFavorito.fulfilled, (state, action) => {
        state.favoritos = state.favoritos.filter((guardado) => guardado.id !== action.payload)
      })
      .addCase(quitarFavorito.rejected, alFallarEnvio)

      // Acciones de usuarioSlice que también cambian los favoritos
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(salir, () => initialState)
  },
})

export default favoritosSlice.reducer
