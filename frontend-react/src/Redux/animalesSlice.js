import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aAnimal, aCuerpoAnimal, aDescuento, diferencias, urlDeFoto } from '../services/animales'
import { hoy } from '../utils/fechas'
import { comoLista, comoPagina, conToken, URL_BASE } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'
import { salir } from './usuarioSlice'
import { darDeBaja } from './usuariosSlice'

// Espeja AnimalService del backend (más fotos y descuentos, que cuelgan de /animales/{id}).
// Los conversores (aAnimal, aCuerpoAnimal...) son los mismos de services/animales.js.

// ---------- GET ----------

// El catálogo: las publicaciones activas, que son públicas
export const traerAnimales = createAsyncThunk('animales/traerAnimales', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/animales`)
    return comoPagina(data).map(aAnimal)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Un animal por su id (la ficha). Va con el token: su refugio puede ver la publicación aunque no esté activa.
export const traerAnimal = createAsyncThunk('animales/traerAnimal', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/animales/${idAnimal}`, conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Las activas, pausadas y pendientes, para los paneles de gestión. Con idRefugio solo las de ese refugio;
// sin idRefugio (el administrador), las de todos.
export const traerPublicaciones = createAsyncThunk('animales/traerPublicaciones', async (idRefugio, { getState, rejectWithValue }) => {
  try {
    const filtro = idRefugio ? `&idRefugio=${idRefugio}` : ''
    const { data } = await axios.get(`${URL_BASE}/animales?estado=ACTIVA,PAUSADA,PENDIENTE${filtro}`, conToken(getState))
    return comoPagina(data).map(aAnimal)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Los cambios que pidieron los refugios sobre publicaciones ya aprobadas: [{ animal, cambios }]
export const traerCambiosPendientes = createAsyncThunk('animales/traerCambiosPendientes', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/animales/cambios-pendientes`, conToken(getState))
    return comoLista(data).map((pendiente) => ({
      animal: aAnimal(pendiente.animal),
      cambios: diferencias(pendiente.animal, pendiente.cambio, pendiente.nombreCategoriaPropuesta),
    }))
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// ---------- POST / PUT / DELETE ----------

// datos = lo que carga el formulario del refugio
export const crearAnimal = createAsyncThunk('animales/crearAnimal', async (datos, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/animales`, aCuerpoAnimal(datos), conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Si ya está publicado, los cambios quedan pendientes de aprobación (vuelve con cambioPendiente: true)
export const editarAnimal = createAsyncThunk('animales/editarAnimal', async ({ idAnimal, datos }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}`, aCuerpoAnimal(datos), conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// estado: 'ACTIVA' la muestra en el catálogo; 'PAUSADA' la oculta sin eliminarla
export const cambiarPublicacion = createAsyncThunk('animales/cambiarPublicacion', async ({ idAnimal, estado }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}`, { estado }, conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// No lo borra de la base: la publicación queda eliminada y deja de verse
export const quitarAnimal = createAsyncThunk('animales/quitarAnimal', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    await axios.delete(`${URL_BASE}/animales/${idAnimal}`, conToken(getState))
    return idAnimal
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// La aprueba un administrador: pasa a ACTIVA y aparece en el catálogo
export const aprobarAnimal = createAsyncThunk('animales/aprobarAnimal', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/aprobar`, null, conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// La rechaza un administrador: queda eliminada y el refugio recibe el motivo
export const rechazarAnimal = createAsyncThunk('animales/rechazarAnimal', async ({ idAnimal, motivo }, { getState, rejectWithValue }) => {
  try {
    await axios.put(`${URL_BASE}/animales/${idAnimal}/rechazar`, { motivo }, conToken(getState))
    return idAnimal
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const aprobarCambios = createAsyncThunk('animales/aprobarCambios', async (idAnimal, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/cambios/aprobar`, null, conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const rechazarCambios = createAsyncThunk('animales/rechazarCambios', async ({ idAnimal, motivo }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/animales/${idAnimal}/cambios/rechazar`, { motivo }, conToken(getState))
    return aAnimal(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// "archivo" es el archivo elegido en un <input type="file">: viaja como formulario. Se agrega al final de la galería.
// Devuelve el animal con la foto nueva.
export const subirFoto = createAsyncThunk('animales/subirFoto', async ({ animal, archivo }, { getState, rejectWithValue }) => {
  try {
    const formulario = new FormData()
    formulario.append('archivo', archivo, 'foto.jpg')
    const { data } = await axios.post(`${URL_BASE}/animales/${animal.id}/fotos/archivo`, formulario, conToken(getState))
    const url = urlDeFoto(data.urlImagen)
    const fotos = animal.sinFotos ? [url] : [...animal.fotos, url]
    return { ...animal, fotos, imagen: fotos[0], sinFotos: false }
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// La oferta rige desde hoy hasta la fecha elegida
export const ponerOferta = createAsyncThunk('animales/ponerOferta', async ({ animal, porcentaje, hasta }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/animales/${animal.id}/descuentos`, { porcentaje, fechaInicio: hoy(), fechaFin: hasta }, conToken(getState))
    return { ...animal, descuento: aDescuento(data) }
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const quitarOferta = createAsyncThunk('animales/quitarOferta', async (animal, { getState, rejectWithValue }) => {
  try {
    await axios.delete(`${URL_BASE}/animales/${animal.id}/descuentos/${animal.descuento.id}`, conToken(getState))
    return { ...animal, descuento: null }
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// La bitácora y la ubicación las ve el padrino dentro de su apadrinamiento: acá solo se publican
export const publicarNovedad = createAsyncThunk('animales/publicarNovedad', async ({ idAnimal, texto }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/animales/${idAnimal}/novedades`, { texto }, conToken(getState))
    return data
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const registrarUbicacion = createAsyncThunk('animales/registrarUbicacion', async ({ idAnimal, latitud, longitud }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/animales/${idAnimal}/ubicaciones`, { latitud, longitud }, conToken(getState))
    return data
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// ---------- Slice ----------

const initialState = {
  items: [], // el catálogo (GET /animales)
  animal: null, // el de la ficha: separado, así no pisa el catálogo
  publicaciones: [], // las de los paneles de gestión (refugio y administrador)
  cambiosPendientes: [], // [{ animal, cambios }]
  loading: false,
  error: null,
  errorAccion: null,
}

// Los "fulfilled" que se repiten en varias acciones

// Las que devuelven el animal ya modificado: se lo pone en cada lista donde esté (y en la ficha si es ese)
const conAnimalModificado = (state, action) => {
  const animal = action.payload
  const index = state.items.findIndex((otro) => otro.id === animal.id)
  if (index !== -1) {
    state.items[index] = animal
  }
  const indexPublicacion = state.publicaciones.findIndex((otro) => otro.id === animal.id)
  if (indexPublicacion !== -1) {
    state.publicaciones[indexPublicacion] = animal
  }
  if (state.animal !== null && state.animal.id === animal.id) {
    state.animal = animal
  }
}

// Las que eliminan el animal (devuelven su id): se lo saca de todas las listas
const conAnimalSacado = (state, action) => {
  const idAnimal = action.payload
  state.items = state.items.filter((otro) => otro.id !== idAnimal)
  state.publicaciones = state.publicaciones.filter((otro) => otro.id !== idAnimal)
  state.cambiosPendientes = state.cambiosPendientes.filter((pendiente) => pendiente.animal.id !== idAnimal)
}

// Aprobados o descartados, los cambios dejan de estar pendientes y el animal queda como lo devolvió el backend
const conCambiosResueltos = (state, action) => {
  conAnimalModificado(state, action)
  state.cambiosPendientes = state.cambiosPendientes.filter((pendiente) => pendiente.animal.id !== action.payload.id)
}

// Las que no cambian ninguna lista de este slice
const terminado = () => {}

const animalesSlice = createSlice({
  name: 'animales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
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

      .addCase(traerCambiosPendientes.pending, alEmpezar)
      .addCase(traerCambiosPendientes.fulfilled, (state, action) => {
        state.loading = false
        state.cambiosPendientes = action.payload
      })
      .addCase(traerCambiosPendientes.rejected, alFallar)

      // POST / PUT / DELETE
      .addCase(crearAnimal.pending, alEnviar)
      .addCase(crearAnimal.fulfilled, (state, action) => {
        state.publicaciones = [...state.publicaciones, action.payload]
      })
      .addCase(crearAnimal.rejected, alFallarEnvio)

      .addCase(editarAnimal.pending, alEnviar)
      .addCase(editarAnimal.fulfilled, conAnimalModificado)
      .addCase(editarAnimal.rejected, alFallarEnvio)

      .addCase(cambiarPublicacion.pending, alEnviar)
      .addCase(cambiarPublicacion.fulfilled, conAnimalModificado)
      .addCase(cambiarPublicacion.rejected, alFallarEnvio)

      .addCase(quitarAnimal.pending, alEnviar)
      .addCase(quitarAnimal.fulfilled, conAnimalSacado)
      .addCase(quitarAnimal.rejected, alFallarEnvio)

      .addCase(aprobarAnimal.pending, alEnviar)
      .addCase(aprobarAnimal.fulfilled, conAnimalModificado)
      .addCase(aprobarAnimal.rejected, alFallarEnvio)

      .addCase(rechazarAnimal.pending, alEnviar)
      .addCase(rechazarAnimal.fulfilled, conAnimalSacado)
      .addCase(rechazarAnimal.rejected, alFallarEnvio)

      .addCase(aprobarCambios.pending, alEnviar)
      .addCase(aprobarCambios.fulfilled, conCambiosResueltos)
      .addCase(aprobarCambios.rejected, alFallarEnvio)

      .addCase(rechazarCambios.pending, alEnviar)
      .addCase(rechazarCambios.fulfilled, conCambiosResueltos)
      .addCase(rechazarCambios.rejected, alFallarEnvio)

      .addCase(subirFoto.pending, alEnviar)
      .addCase(subirFoto.fulfilled, conAnimalModificado)
      .addCase(subirFoto.rejected, alFallarEnvio)

      .addCase(ponerOferta.pending, alEnviar)
      .addCase(ponerOferta.fulfilled, conAnimalModificado)
      .addCase(ponerOferta.rejected, alFallarEnvio)

      .addCase(quitarOferta.pending, alEnviar)
      .addCase(quitarOferta.fulfilled, conAnimalModificado)
      .addCase(quitarOferta.rejected, alFallarEnvio)

      .addCase(publicarNovedad.pending, alEnviar)
      .addCase(publicarNovedad.fulfilled, terminado)
      .addCase(publicarNovedad.rejected, alFallarEnvio)

      .addCase(registrarUbicacion.pending, alEnviar)
      .addCase(registrarUbicacion.fulfilled, terminado)
      .addCase(registrarUbicacion.rejected, alFallarEnvio)

      // Acciones de otros slices que también cambian los animales:
      // al dar de baja a un refugio, el backend pausa sus publicaciones
      .addCase(darDeBaja.fulfilled, (state, action) => {
        const { idRefugio } = action.payload
        if (idRefugio) {
          state.publicaciones = state.publicaciones.map((animal) => (animal.idRefugio === idRefugio ? { ...animal, publicacion: 'PAUSADA' } : animal))
        }
      })
      // Las publicaciones de gestión son de quien inició sesión: al salir se vacían
      .addCase(salir, (state) => {
        state.publicaciones = []
        state.cambiosPendientes = []
      })
  },
})

export default animalesSlice.reducer
