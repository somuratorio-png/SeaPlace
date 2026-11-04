import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aUsuario, entrarCon } from '../services/usuarios'
import { conToken, URL_BASE } from './api'
import { alEmpezar, alFallar } from './casos'

// Espeja AuthenticationService, SesionService y la parte "mi cuenta" de UsuarioService:
// quién inició sesión y su token. Es el último que se migra en los componentes.
// Los favoritos y el muelle que llegan con la sesión los guardan sus propios slices (escuchan ingresar y registrar).

// ---------- Acciones asíncronas ----------

// "planes" hacen falta para armar los ítems del muelle que trae la sesión. Devuelve { token, sesion }.
export const ingresar = createAsyncThunk('usuario/ingresar', async ({ planes, nombreUsuario, contrasenia }) => {
  const { data } = await axios.post(`${URL_BASE}/auth/authenticate`, { nombreUsuario, contrasenia })
  return entrarCon(planes, data)
})

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
export const registrar = createAsyncThunk('usuario/registrar', async ({ planes, datos, esRefugio }) => {
  const { data } = esRefugio
    ? await axios.post(`${URL_BASE}/auth/register-refugio`, { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido })
    : await axios.post(`${URL_BASE}/auth/register`, datos)
  return entrarCon(planes, data)
})

export const modificarMiPerfil = createAsyncThunk('usuario/modificarMiPerfil', async ({ token, nombre, apellido, mail }) => {
  const { data } = await axios.put(`${URL_BASE}/usuarios/me`, { nombre, apellido, mail }, conToken(token))
  return aUsuario(data)
})

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = createAsyncThunk('usuario/cambiarMiContrasenia', async ({ token, contraseniaActual, contraseniaNueva }) => {
  await axios.put(`${URL_BASE}/usuarios/me/contrasenia`, { contraseniaActual, contraseniaNueva }, conToken(token))
})

// Olvidé mi contraseña: pide un código de un solo uso (sale impreso en la consola del servidor).
// Devuelve el mensaje del backend, que es el mismo exista o no el mail.
export const pedirCodigo = createAsyncThunk('usuario/pedirCodigo', async ({ mail }) => {
  const { data } = await axios.post(`${URL_BASE}/auth/olvide-contrasenia`, { mail })
  return data.mensaje
})

export const restablecerContrasenia = createAsyncThunk('usuario/restablecerContrasenia', async ({ mail, codigo, contraseniaNueva }) => {
  await axios.post(`${URL_BASE}/auth/restablecer-contrasenia`, { mail, codigo, contraseniaNueva })
})

// ---------- Slice ----------

const initialState = {
  usuario: null, // null = nadie inició sesión
  token: null, // vive solo en memoria: al recargar la página se pierde y hay que volver a entrar
  mensaje: null, // el que devuelve "pedir código"
  loading: false,
  error: null,
}

// Al ingresar o registrarse queda logueado
const conSesion = (state, action) => {
  state.loading = false
  state.token = action.payload.token
  state.usuario = action.payload.sesion.usuario
}

// Las que no cambian nada guardado
const terminado = (state) => {
  state.loading = false
}

const usuarioSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    // Cierra la sesión. Los slices de favoritos y muelle también la escuchan para vaciarse.
    salir: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingresar.pending, alEmpezar)
      .addCase(ingresar.fulfilled, conSesion)
      .addCase(ingresar.rejected, alFallar)

      .addCase(registrar.pending, alEmpezar)
      .addCase(registrar.fulfilled, conSesion)
      .addCase(registrar.rejected, alFallar)

      .addCase(modificarMiPerfil.pending, alEmpezar)
      .addCase(modificarMiPerfil.fulfilled, (state, action) => {
        state.loading = false
        state.usuario = action.payload
      })
      .addCase(modificarMiPerfil.rejected, alFallar)

      .addCase(cambiarMiContrasenia.pending, alEmpezar)
      .addCase(cambiarMiContrasenia.fulfilled, terminado)
      .addCase(cambiarMiContrasenia.rejected, alFallar)

      .addCase(pedirCodigo.pending, alEmpezar)
      .addCase(pedirCodigo.fulfilled, (state, action) => {
        state.loading = false
        state.mensaje = action.payload
      })
      .addCase(pedirCodigo.rejected, alFallar)

      .addCase(restablecerContrasenia.pending, alEmpezar)
      .addCase(restablecerContrasenia.fulfilled, terminado)
      .addCase(restablecerContrasenia.rejected, alFallar)
  },
})

export const { salir } = usuarioSlice.actions

export default usuarioSlice.reducer
