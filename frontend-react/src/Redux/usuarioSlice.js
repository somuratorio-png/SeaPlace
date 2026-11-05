import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aUsuario, entrarCon } from '../services/usuarios'
import { conToken, planesDe, URL_BASE } from './api'
import { alEnviar, alFallarEnvio } from './casos'

// Espeja AuthenticationService, SesionService y la parte "mi cuenta" de UsuarioService:
// quién inició sesión y su token. El token lo leen todos los slices para mandarlo en cada pedido (ver conToken).
// Los favoritos y el muelle que llegan con la sesión los guardan sus propios slices (escuchan ingresar y registrar).
// Todas sus acciones mandan datos (no hay GET que llene una pantalla): usan errorAccion.

// ---------- Acciones asíncronas ----------

// Devuelve { token, sesion }. Los planes hacen falta para armar los ítems del muelle que trae la sesión.
export const ingresar = createAsyncThunk('usuario/ingresar', async ({ nombreUsuario, contrasenia }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/auth/authenticate`, { nombreUsuario, contrasenia })
    return entrarCon(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
export const registrar = createAsyncThunk('usuario/registrar', async ({ datos, esRefugio }, { getState, rejectWithValue }) => {
  try {
    const { data } = esRefugio
      ? await axios.post(`${URL_BASE}/auth/register-refugio`, { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido })
      : await axios.post(`${URL_BASE}/auth/register`, datos)
    return entrarCon(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const modificarMiPerfil = createAsyncThunk('usuario/modificarMiPerfil', async ({ nombre, apellido, mail }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/me`, { nombre, apellido, mail }, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = createAsyncThunk('usuario/cambiarMiContrasenia', async ({ contraseniaActual, contraseniaNueva }, { getState, rejectWithValue }) => {
  try {
    await axios.put(`${URL_BASE}/usuarios/me/contrasenia`, { contraseniaActual, contraseniaNueva }, conToken(getState))
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// Olvidé mi contraseña: pide un código de un solo uso (sale impreso en la consola del servidor).
// Devuelve el mensaje del backend, que es el mismo exista o no el mail.
export const pedirCodigo = createAsyncThunk('usuario/pedirCodigo', async (mail, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/auth/olvide-contrasenia`, { mail })
    return data.mensaje
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

export const restablecerContrasenia = createAsyncThunk('usuario/restablecerContrasenia', async ({ mail, codigo, contraseniaNueva }, { rejectWithValue }) => {
  try {
    await axios.post(`${URL_BASE}/auth/restablecer-contrasenia`, { mail, codigo, contraseniaNueva })
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { mensaje: 'No se pudo conectar con el servidor' })
  }
})

// ---------- Slice ----------

const initialState = {
  usuario: null, // null = nadie inició sesión
  token: null, // vive solo en memoria: al recargar la página se pierde y hay que volver a entrar
  mensaje: null, // el que devuelve "pedir código"
  errorAccion: null,
}

// Al ingresar o registrarse queda logueado
const conSesion = (state, action) => {
  state.token = action.payload.token
  state.usuario = action.payload.sesion.usuario
}

// Las que no cambian nada guardado
const terminado = () => {}

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    // Cierra la sesión. Los slices con datos de quien estaba logueado también la escuchan para vaciarse.
    salir: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingresar.pending, alEnviar)
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(ingresar.rejected, alFallarEnvio)

      .addCase(registrar.pending, alEnviar)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(registrar.rejected, alFallarEnvio)

      .addCase(modificarMiPerfil.pending, alEnviar)
      .addCase(modificarMiPerfil.fulfilled, (state, action) => {
        state.usuario = action.payload
      })
      .addCase(modificarMiPerfil.rejected, alFallarEnvio)

      .addCase(cambiarMiContrasenia.pending, alEnviar)
      .addCase(cambiarMiContrasenia.fulfilled, terminado)
      .addCase(cambiarMiContrasenia.rejected, alFallarEnvio)

      .addCase(pedirCodigo.pending, alEnviar)
      .addCase(pedirCodigo.fulfilled, (state, action) => {
        state.mensaje = action.payload
      })
      .addCase(pedirCodigo.rejected, alFallarEnvio)

      .addCase(restablecerContrasenia.pending, alEnviar)
      .addCase(restablecerContrasenia.fulfilled, terminado)
      .addCase(restablecerContrasenia.rejected, alFallarEnvio)
  },
})

export const { salir } = usuarioSlice.actions

export default usuarioSlice.reducer
