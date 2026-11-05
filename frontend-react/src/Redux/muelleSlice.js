import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aItem } from '../services/apadrinar'
import { conToken, planesDe, URL_BASE } from './api'
import { alEnviar, alFallarEnvio } from './casos'
import { ingresar, registrar, salir } from './usuarioSlice'

// El carrito de SeaPlace: espeja MuelleService y ZarparService del backend.
// Cada ítem: { idMuelle, animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
// El muelle vive en el backend (valida cupos, cobra al zarpar), así que todo pasa por extraReducers.
// No hay un GET propio: llega con la sesión, al ingresar o registrarse.

// ---------- Acciones asíncronas ----------

// Pone el animal en el muelle. Si ya estaba, solo le cambia el plan (conserva los cupos elegidos).
// Con id en null (después de zarpar) el backend abre un muelle nuevo: el ítem que devuelve trae su id.
export const agregarAlMuelle = createAsyncThunk('muelle/agregarAlMuelle', async ({ idAnimal, codigoPlan }, { getState }) => {
  const muelle = getState().muelle
  const yaEstaba = muelle.items.find((item) => item.animal.id === idAnimal)
  const { data } = yaEstaba
    ? await axios.put(`${URL_BASE}/muelles/${muelle.id}/items/${idAnimal}`, { cantidad: yaEstaba.cantidad, plan: codigoPlan }, conToken(getState))
    : await axios.post(`${URL_BASE}/muelles/items`, { idMuelle: muelle.id, idAnimal, cantidad: 1, plan: codigoPlan }, conToken(getState))
  return aItem(planesDe(getState), data)
})

// La cantidad va de 1 hasta los cupos que le quedan al animal (igual que valida el backend)
export const cambiarCantidad = createAsyncThunk('muelle/cambiarCantidad', async ({ item, cantidad }, { getState }) => {
  const acotada = Math.min(item.animal.cuposDisponibles, Math.max(1, cantidad))
  const { data } = await axios.put(`${URL_BASE}/muelles/${getState().muelle.id}/items/${item.animal.id}`, { cantidad: acotada }, conToken(getState))
  return aItem(planesDe(getState), data)
})

export const quitarDelMuelle = createAsyncThunk('muelle/quitarDelMuelle', async (idAnimal, { getState }) => {
  await axios.delete(`${URL_BASE}/muelles/${getState().muelle.id}/items/${idAnimal}`, conToken(getState))
  return idAnimal
})

// Confirma el muelle: el backend valida los cupos, cobra y crea los apadrinamientos. Devuelve el total pagado.
// El muelle pagado queda cerrado: quien zarpa lo vacía con vaciarMuelle cuando ya se fue a la página de gracias.
export const zarpar = createAsyncThunk('muelle/zarpar', async (conBotiquin, { getState }) => {
  const { data } = await axios.post(`${URL_BASE}/zarpar`, { idMuelle: getState().muelle.id, conBotiquin }, conToken(getState))
  return data.total
})

// ---------- Slice ----------

const initialState = {
  id: null, // null = todavía no tiene muelle abierto
  items: [],
  enviando: false,
  errorAccion: null,
}

// Pone el ítem en el muelle: si el animal ya estaba lo reemplaza; si no, lo agrega
const conItem = (state, action) => {
  const item = action.payload
  state.enviando = false
  state.id = item.idMuelle
  const posicion = state.items.findIndex((otro) => otro.animal.id === item.animal.id)
  if (posicion !== -1) {
    state.items[posicion] = item
  } else {
    state.items = [...state.items, item]
  }
}

const conSesion = (state, action) => {
  state.id = action.payload.sesion.muelle.id
  state.items = action.payload.sesion.muelle.items
}

const muelleSlice = createSlice({
  name: 'muelle',
  initialState,
  reducers: {
    // Deja el muelle vacío sin pedir nada al backend (después de zarpar)
    vaciarMuelle: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(agregarAlMuelle.pending, alEnviar)
      .addCase(agregarAlMuelle.fulfilled, conItem)
      .addCase(agregarAlMuelle.rejected, alFallarEnvio)

      .addCase(cambiarCantidad.pending, alEnviar)
      .addCase(cambiarCantidad.fulfilled, conItem)
      .addCase(cambiarCantidad.rejected, alFallarEnvio)

      .addCase(quitarDelMuelle.pending, alEnviar)
      .addCase(quitarDelMuelle.fulfilled, (state, action) => {
        state.enviando = false
        state.items = state.items.filter((item) => item.animal.id !== action.payload)
      })
      .addCase(quitarDelMuelle.rejected, alFallarEnvio)

      .addCase(zarpar.pending, alEnviar)
      .addCase(zarpar.fulfilled, (state) => {
        state.enviando = false
      })
      .addCase(zarpar.rejected, alFallarEnvio)

      // Acciones de usuarioSlice que también cambian el muelle
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(salir, () => initialState)
  },
})

export const { vaciarMuelle } = muelleSlice.actions

export default muelleSlice.reducer
