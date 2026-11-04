import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aAnimal, aCuerpoAnimal, aDescuento, diferencias, urlDeFoto } from '../services/animales'
import { hoy } from '../utils/fechas'
import { comoLista, comoPagina, conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja AnimalService del backend (más fotos y descuentos, que cuelgan de /animales/{id}).
// Los conversores (aAnimal, aCuerpoAnimal...) son los mismos de services/animales.js.

// ---------- Acciones asíncronas ----------

// El catálogo: las publicaciones activas, que son públicas
export const traerAnimales = createAsyncThunk('animales/traerAnimales', async () => {
  const { data } = await axios.get(`${URL_BASE}/animales`)
  return comoPagina(data).map(aAnimal)
})

// Un animal por su id (la pantalla de detalle). Si no existe el backend responde 404.
export const traerAnimal = createAsyncThunk('animales/traerAnimal', async ({ token, idAnimal }) => {
  const { data } = await axios.get(`${URL_BASE}/animales/${idAnimal}`, conToken(token))
  return aAnimal(data)
})

// Las activas, pausadas y pendientes, para los paneles de gestión. Con idRefugio solo las de ese refugio.
export const traerPublicaciones = createAsyncThunk('animales/traerPublicaciones', async ({ token, idRefugio }) => {
  const filtro = idRefugio ? `&idRefugio=${idRefugio}` : ''
  const { data } = await axios.get(`${URL_BASE}/animales?estado=ACTIVA,PAUSADA,PENDIENTE${filtro}`, conToken(token))
  return comoPagina(data).map(aAnimal)
})

// datos = lo que carga el formulario del refugio
export const crearAnimal = createAsyncThunk('animales/crearAnimal', async ({ token, datos }) => {
  const { data } = await axios.post(`${URL_BASE}/animales`, aCuerpoAnimal(datos), conToken(token))
  return aAnimal(data)
})

// Si ya está publicado, los cambios quedan pendientes de aprobación (vuelve con cambioPendiente: true)
export const editarAnimal = createAsyncThunk('animales/editarAnimal', async ({ token, idAnimal, datos }) => {
  const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}`, aCuerpoAnimal(datos), conToken(token))
  return aAnimal(data)
})

// estado: 'ACTIVA' la muestra en el catálogo; 'PAUSADA' la oculta sin eliminarla
export const cambiarPublicacion = createAsyncThunk('animales/cambiarPublicacion', async ({ token, idAnimal, estado }) => {
  const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}`, { estado }, conToken(token))
  return aAnimal(data)
})

export const quitarAnimal = createAsyncThunk('animales/quitarAnimal', async ({ token, idAnimal }) => {
  await axios.delete(`${URL_BASE}/animales/${idAnimal}`, conToken(token))
  return idAnimal
})

// La aprueba un administrador: pasa a ACTIVA y aparece en el catálogo
export const aprobarAnimal = createAsyncThunk('animales/aprobarAnimal', async ({ token, idAnimal }) => {
  const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/aprobar`, null, conToken(token))
  return aAnimal(data)
})

// La rechaza un administrador: queda eliminada y el refugio recibe el motivo
export const rechazarAnimal = createAsyncThunk('animales/rechazarAnimal', async ({ token, idAnimal, motivo }) => {
  await axios.put(`${URL_BASE}/animales/${idAnimal}/rechazar`, { motivo }, conToken(token))
  return idAnimal
})

// Los cambios que pidieron los refugios sobre publicaciones ya aprobadas: [{ animal, cambios }]
export const traerCambiosPendientes = createAsyncThunk('animales/traerCambiosPendientes', async ({ token }) => {
  const { data } = await axios.get(`${URL_BASE}/animales/cambios-pendientes`, conToken(token))
  return comoLista(data).map((pendiente) => ({
    animal: aAnimal(pendiente.animal),
    cambios: diferencias(pendiente.animal, pendiente.cambio, pendiente.nombreCategoriaPropuesta),
  }))
})

export const aprobarCambios = createAsyncThunk('animales/aprobarCambios', async ({ token, idAnimal }) => {
  const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/cambios/aprobar`, null, conToken(token))
  return aAnimal(data)
})

export const rechazarCambios = createAsyncThunk('animales/rechazarCambios', async ({ token, idAnimal, motivo }) => {
  const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/cambios/rechazar`, { motivo }, conToken(token))
  return aAnimal(data)
})

// "archivo" es el archivo elegido en un <input type="file">: viaja como formulario. Se agrega al final de la galería.
export const subirFoto = createAsyncThunk('animales/subirFoto', async ({ token, animal, archivo }) => {
  const formulario = new FormData()
  formulario.append('archivo', archivo, 'foto.jpg')
  const { data } = await axios.post(`${URL_BASE}/animales/${animal.id}/fotos/archivo`, formulario, conToken(token))
  const url = urlDeFoto(data.urlImagen)
  const fotos = animal.sinFotos ? [url] : [...animal.fotos, url]
  return { ...animal, fotos, imagen: fotos[0], sinFotos: false }
})

// La oferta rige desde hoy hasta la fecha elegida
export const ponerOferta = createAsyncThunk('animales/ponerOferta', async ({ token, animal, porcentaje, hasta }) => {
  const { data } = await axios.post(`${URL_BASE}/animales/${animal.id}/descuentos`, { porcentaje, fechaInicio: hoy(), fechaFin: hasta }, conToken(token))
  return { ...animal, descuento: aDescuento(data) }
})

export const quitarOferta = createAsyncThunk('animales/quitarOferta', async ({ token, animal }) => {
  await axios.delete(`${URL_BASE}/animales/${animal.id}/descuentos/${animal.descuento.id}`, conToken(token))
  return { ...animal, descuento: null }
})

// La bitácora y la ubicación las ve el padrino dentro de su apadrinamiento: acá solo se publican
export const publicarNovedad = createAsyncThunk('animales/publicarNovedad', async ({ token, idAnimal, texto }) => {
  const { data } = await axios.post(`${URL_BASE}/animales/${idAnimal}/novedades`, { texto }, conToken(token))
  return data
})

export const registrarUbicacion = createAsyncThunk('animales/registrarUbicacion', async ({ token, idAnimal, latitud, longitud }) => {
  const { data } = await axios.post(`${URL_BASE}/animales/${idAnimal}/ubicaciones`, { latitud, longitud }, conToken(token))
  return data
})

// ---------- Slice ----------

// Los filtros del catálogo, con los mismos valores iniciales que usa la pantalla
const SIN_FILTROS = { busqueda: '', categoria: 'todas', urgencia: 'todas', orden: 'recomendados', soloFavoritos: false, precioMin: '', precioMax: '' }

const initialState = {
  items: [], // el catálogo (GET /animales)
  animal: null, // el del detalle: separado, así no pisa el catálogo
  publicaciones: [], // las de los paneles de gestión (refugio y administrador)
  cambiosPendientes: [], // [{ animal, cambios }]
  filtros: SIN_FILTROS,
  loading: false,
  error: null,
}

// Los "fulfilled" que se repiten en varias acciones

// Las que devuelven el animal ya modificado: se lo pone en cada lista donde esté (y en el detalle si es ese)
const conAnimalModificado = (state, action) => {
  const animal = action.payload
  state.loading = false
  state.items = state.items.map((otro) => (otro.id === animal.id ? animal : otro))
  state.publicaciones = state.publicaciones.map((otro) => (otro.id === animal.id ? animal : otro))
  if (state.animal?.id === animal.id) {
    state.animal = animal
  }
}

// Las que eliminan el animal (devuelven su id): se lo saca de todas las listas
const conAnimalSacado = (state, action) => {
  const idAnimal = action.payload
  state.loading = false
  state.items = state.items.filter((otro) => otro.id !== idAnimal)
  state.publicaciones = state.publicaciones.filter((otro) => otro.id !== idAnimal)
  state.cambiosPendientes = state.cambiosPendientes.filter((pendiente) => pendiente.animal.id !== idAnimal)
}

// Aprobados o descartados, los cambios dejan de estar pendientes y el animal queda como lo devolvió el backend
const conCambiosResueltos = (state, action) => {
  conAnimalModificado(state, action)
  state.cambiosPendientes = state.cambiosPendientes.filter((pendiente) => pendiente.animal.id !== action.payload.id)
}

const animalesSlice = createSlice({
  name: 'animales',
  initialState,
  reducers: {
    // action.payload = { campo: 'urgencia', valor: 'critico' }
    cambiarFiltro: (state, action) => {
      state.filtros[action.payload.campo] = action.payload.valor
    },
    limpiarFiltros: (state) => {
      state.filtros = SIN_FILTROS
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(traerAnimales.pending, alEmpezar)
      .addCase(traerAnimales.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(traerAnimales.rejected, alFallar)

      .addCase(traerAnimal.pending, alEmpezar)
      .addCase(traerAnimal.fulfilled, (state, action) => {
        state.loading = false
        state.animal = action.payload
      })
      .addCase(traerAnimal.rejected, alFallar)

      .addCase(traerPublicaciones.pending, alEmpezar)
      .addCase(traerPublicaciones.fulfilled, (state, action) => {
        state.loading = false
        state.publicaciones = action.payload
      })
      .addCase(traerPublicaciones.rejected, alFallar)

      .addCase(crearAnimal.pending, alEmpezar)
      .addCase(crearAnimal.fulfilled, (state, action) => {
        state.loading = false
        state.publicaciones.push(action.payload)
      })
      .addCase(crearAnimal.rejected, alFallar)

      .addCase(editarAnimal.pending, alEmpezar)
      .addCase(editarAnimal.fulfilled, conAnimalModificado)
      .addCase(editarAnimal.rejected, alFallar)

      .addCase(cambiarPublicacion.pending, alEmpezar)
      .addCase(cambiarPublicacion.fulfilled, conAnimalModificado)
      .addCase(cambiarPublicacion.rejected, alFallar)

      .addCase(quitarAnimal.pending, alEmpezar)
      .addCase(quitarAnimal.fulfilled, conAnimalSacado)
      .addCase(quitarAnimal.rejected, alFallar)

      .addCase(aprobarAnimal.pending, alEmpezar)
      .addCase(aprobarAnimal.fulfilled, conAnimalModificado)
      .addCase(aprobarAnimal.rejected, alFallar)

      .addCase(rechazarAnimal.pending, alEmpezar)
      .addCase(rechazarAnimal.fulfilled, conAnimalSacado)
      .addCase(rechazarAnimal.rejected, alFallar)

      .addCase(traerCambiosPendientes.pending, alEmpezar)
      .addCase(traerCambiosPendientes.fulfilled, (state, action) => {
        state.loading = false
        state.cambiosPendientes = action.payload
      })
      .addCase(traerCambiosPendientes.rejected, alFallar)

      .addCase(aprobarCambios.pending, alEmpezar)
      .addCase(aprobarCambios.fulfilled, conCambiosResueltos)
      .addCase(aprobarCambios.rejected, alFallar)

      .addCase(rechazarCambios.pending, alEmpezar)
      .addCase(rechazarCambios.fulfilled, conCambiosResueltos)
      .addCase(rechazarCambios.rejected, alFallar)

      .addCase(subirFoto.pending, alEmpezar)
      .addCase(subirFoto.fulfilled, conAnimalModificado)
      .addCase(subirFoto.rejected, alFallar)

      .addCase(ponerOferta.pending, alEmpezar)
      .addCase(ponerOferta.fulfilled, conAnimalModificado)
      .addCase(ponerOferta.rejected, alFallar)

      .addCase(quitarOferta.pending, alEmpezar)
      .addCase(quitarOferta.fulfilled, conAnimalModificado)
      .addCase(quitarOferta.rejected, alFallar)

      // Estas dos no cambian ninguna lista de este slice
      .addCase(publicarNovedad.pending, alEmpezar)
      .addCase(publicarNovedad.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(publicarNovedad.rejected, alFallar)

      .addCase(registrarUbicacion.pending, alEmpezar)
      .addCase(registrarUbicacion.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registrarUbicacion.rejected, alFallar)
  },
})

export const { cambiarFiltro, limpiarFiltros } = animalesSlice.actions

export default animalesSlice.reducer
