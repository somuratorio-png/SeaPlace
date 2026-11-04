import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aItem } from '../services/apadrinar'
import { conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'
import { ingresar, registrar, salir } from './usuarioSlice'

// El carrito de SeaPlace: espeja MuelleService y ZarparService del backend.
// Cada ítem: { idMuelle, animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
// El muelle vive en el backend (valida cupos, cobra al zarpar), así que todo pasa por extraReducers.
// "planes" (de planesSlice) hacen falta para armar el plan completo de cada ítem (ver aItem).

// ---------- Acciones asíncronas ----------

// Pone el animal en el muelle. Si ya estaba, solo le cambia el plan (conserva los cupos elegidos).
// Con id en null (después de zarpar) el backend abre un muelle nuevo: el ítem que devuelve trae su id.
export const agregarAlMuelle = createAsyncThunk('muelle/agregarAlMuelle', async ({ token, planes, idAnimal, codigoPlan }, { getState }) => {
  const muelle = getState().muelle
  const yaEstaba = muelle.items.find((item) => item.animal.id === idAnimal)
  const { data } = yaEstaba
    ? await axios.put(`${URL_BASE}/muelles/${muelle.id}/items/${idAnimal}`, { cantidad: yaEstaba.cantidad, plan: codigoPlan }, conToken(token))
    : await axios.post(`${URL_BASE}/muelles/items`, { idMuelle: muelle.id, idAnimal, cantidad: 1, plan: codigoPlan }, conToken(token))
  return aItem(planes, data)
})

// La cantidad va de 1 hasta los cupos que le quedan al animal (igual que valida el backend)
export const cambiarCantidad = createAsyncThunk('muelle/cambiarCantidad', async ({ token, planes, item, cantidad }, { getState }) => {
  const acotada = Math.min(item.animal.cuposDisponibles, Math.max(1, cantidad))
  const { data } = await axios.put(`${URL_BASE}/muelles/${getState().muelle.id}/items/${item.animal.id}`, { cantidad: acotada }, conToken(token))
  return aItem(planes, data)
})

export const quitarDelMuelle = createAsyncThunk('muelle/quitarDelMuelle', async ({ token, idAnimal }, { getState }) => {
  await axios.delete(`${URL_BASE}/muelles/${getState().muelle.id}/items/${idAnimal}`, conToken(token))
  return idAnimal
})

// Confirma el muelle: el backend valida los cupos, cobra y crea los apadrinamientos. Devuelve el total pagado.
export const zarpar = createAsyncThunk('muelle/zarpar', async ({ token, conBotiquin }, { getState }) => {
  const { data } = await axios.post(`${URL_BASE}/zarpar`, { idMuelle: getState().muelle.id, conBotiquin }, conToken(token))
  return data.total
})

// ---------- Slice ----------

const initialState = {
  id: null, // null = todavía no tiene muelle abierto
  items: [],
  totalPagado: null, // lo que se cobró en el último zarpe
  loading: false,
  error: null,
}

// Pone el ítem en el muelle: si el animal ya estaba lo reemplaza; si no, lo agrega
const conItem = (state, action) => {
  const item = action.payload
  state.loading = false
  state.id = item.idMuelle
  const posicion = state.items.findIndex((otro) => otro.animal.id === item.animal.id)
  if (posicion === -1) {
    state.items.push(item)
  } else {
    state.items[posicion] = item
  }
}

// El muelle llega con la sesión, al ingresar o registrarse
const conSesion = (state, action) => {
  state.id = action.payload.sesion.muelle.id
  state.items = action.payload.sesion.muelle.items
}

const muelleSlice = createSlice({
  name: 'muelle',
  initialState,
  reducers: {
    // Deja el muelle vacío sin pedir nada al backend
    vaciarMuelle: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(agregarAlMuelle.pending, alEmpezar)
      .addCase(agregarAlMuelle.fulfilled, conItem)
      .addCase(agregarAlMuelle.rejected, alFallar)

      .addCase(cambiarCantidad.pending, alEmpezar)
      .addCase(cambiarCantidad.fulfilled, conItem)
      .addCase(cambiarCantidad.rejected, alFallar)

      .addCase(quitarDelMuelle.pending, alEmpezar)
      .addCase(quitarDelMuelle.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item.animal.id !== action.payload)
      })
      .addCase(quitarDelMuelle.rejected, alFallar)

      // El muelle pagado queda cerrado: el próximo animal que se agregue abre uno nuevo
      .addCase(zarpar.pending, alEmpezar)
      .addCase(zarpar.fulfilled, (state, action) => {
        state.loading = false
        state.id = null
        state.items = []
        state.totalPagado = action.payload
      })
      .addCase(zarpar.rejected, alFallar)

      // Acciones de usuarioSlice que también cambian el muelle
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(salir, () => initialState)
  },
})

export const { vaciarMuelle } = muelleSlice.actions

export default muelleSlice.reducer
