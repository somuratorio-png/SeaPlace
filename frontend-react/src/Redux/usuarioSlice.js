import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { aUsuario, entrarCon } from '../services/usuarios'
import { comoPagina, conToken, planesDe, URL_BASE, conError } from './api'
import { alEmpezar, alEnviar, alFallar, alFallarEnvio } from './casos'

// Espeja AuthenticationService, SesionService, UsuarioService y la parte de administrador de RefugioService.
// Guarda dos cosas:
// - quién inició sesión y su token. El token lo leen todos los slices para mandarlo en cada pedido (ver conToken).
//   Los favoritos y el muelle que llegan con la sesión los guardan sus propios slices (escuchan ingresar y registrar).
// - la lista de usuarios que administra el administrador (traerUsuarios y las acciones sobre cada cuenta).

// ---------- Acciones asíncronas ----------

// Devuelve { token, sesion }. Los planes hacen falta para armar los ítems del muelle que trae la sesión.
export const ingresar = createAsyncThunk('usuario/ingresar', async ({ nombreUsuario, contrasenia }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/auth/authenticate`, { nombreUsuario, contrasenia })
    return entrarCon(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
// tipo = 'padrino' | 'refugio' | 'patrocinador'. Un patrocinador manda además el nombre de su empresa (datos.empresa).
const pedirRegistro = (datos, tipo) => {
  if (tipo === 'refugio') {
    return axios.post(`${URL_BASE}/auth/register-refugio`, { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido })
  }
  if (tipo === 'patrocinador') {
    return axios.post(`${URL_BASE}/auth/register-patrocinador`, { ...datos, nombreEmpresa: datos.empresa })
  }
  return axios.post(`${URL_BASE}/auth/register`, datos)
}

export const registrar = createAsyncThunk('usuario/registrar', async ({ datos, tipo }, { getState, rejectWithValue }) => {
  try {
    const { data } = await pedirRegistro(datos, tipo)
    return entrarCon(planesDe(getState), data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const modificarMiPerfil = createAsyncThunk('usuario/modificarMiPerfil', async ({ nombre, apellido, mail }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/me`, { nombre, apellido, mail }, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = createAsyncThunk('usuario/cambiarMiContrasenia', async ({ contraseniaActual, contraseniaNueva }, { getState, rejectWithValue }) => {
  try {
    await axios.put(`${URL_BASE}/usuarios/me/contrasenia`, { contraseniaActual, contraseniaNueva }, conToken(getState))
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Olvidé mi contraseña: pide un código de un solo uso (sale impreso en la consola del servidor).
// Devuelve el mensaje del backend, que es el mismo exista o no el mail.
export const pedirCodigo = createAsyncThunk('usuario/pedirCodigo', async (mail, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${URL_BASE}/auth/olvide-contrasenia`, { mail })
    return data.mensaje
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const restablecerContrasenia = createAsyncThunk('usuario/restablecerContrasenia', async ({ mail, codigo, contraseniaNueva }, { rejectWithValue }) => {
  try {
    await axios.post(`${URL_BASE}/auth/restablecer-contrasenia`, { mail, codigo, contraseniaNueva })
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// ---------- Administración de cuentas (solo el administrador) ----------

export const traerUsuarios = createAsyncThunk('usuario/traerUsuarios', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${URL_BASE}/usuarios`, conToken(getState))
    return comoPagina(data).map(aUsuario)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado
export const cambiarRol = createAsyncThunk('usuario/cambiarRol', async ({ idUsuario, idRol }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/rol`, { idRol }, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// No borra al usuario: lo deja inactivo. Si es un refugio, el backend pausa sus publicaciones (ver animalesSlice).
export const darDeBaja = createAsyncThunk('usuario/darDeBaja', async (idUsuario, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`${URL_BASE}/usuarios/${idUsuario}`, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const reactivar = createAsyncThunk('usuario/reactivar', async (idUsuario, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${URL_BASE}/usuarios/${idUsuario}/reactivar`, null, conToken(getState))
    return aUsuario(data)
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

export const aprobarRefugio = createAsyncThunk('usuario/aprobarRefugio', async (idRefugio, { getState, rejectWithValue }) => {
  try {
    await axios.put(`${URL_BASE}/refugios/${idRefugio}/aprobar`, null, conToken(getState))
    return idRefugio
  } catch (error) {
    return rejectWithValue(conError(error))
  }
})

// ---------- Slice ----------

const initialState = {
  usuario: null, // null = nadie inició sesión
  token: null, // vive solo en memoria: al recargar la página se pierde y hay que volver a entrar
  mensaje: null, // el que devuelve "pedir código"
  usuarios: [], // los que ve el administrador (GET /usuarios)
  loading: false,
  error: null,
  errorAccion: null,
}

// Al ingresar o registrarse queda logueado
const conSesion = (state, action) => {
  state.token = action.payload.token
  state.usuario = action.payload.sesion.usuario
}

// Las que devuelven el usuario modificado: se lo reemplaza en la lista
const conUsuarioModificado = (state, action) => {
  const index = state.usuarios.findIndex((otro) => otro.id === action.payload.id)
  if (index !== -1) {
    state.usuarios[index] = action.payload
  }
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

      .addCase(traerUsuarios.pending, alEmpezar)
      .addCase(traerUsuarios.fulfilled, (state, action) => {
        state.loading = false
        state.usuarios = action.payload
      })
      .addCase(traerUsuarios.rejected, alFallar)

      .addCase(cambiarRol.pending, alEnviar)
      .addCase(cambiarRol.fulfilled, conUsuarioModificado)
      .addCase(cambiarRol.rejected, alFallarEnvio)

      .addCase(darDeBaja.pending, alEnviar)
      .addCase(darDeBaja.fulfilled, conUsuarioModificado)
      .addCase(darDeBaja.rejected, alFallarEnvio)

      .addCase(reactivar.pending, alEnviar)
      .addCase(reactivar.fulfilled, conUsuarioModificado)
      .addCase(reactivar.rejected, alFallarEnvio)

      // El dueño de ese refugio deja de estar pendiente
      .addCase(aprobarRefugio.pending, alEnviar)
      .addCase(aprobarRefugio.fulfilled, (state, action) => {
        const index = state.usuarios.findIndex((usuario) => usuario.idRefugio === action.payload)
        if (index !== -1) {
          state.usuarios[index] = { ...state.usuarios[index], aprobado: true }
        }
      })
      .addCase(aprobarRefugio.rejected, alFallarEnvio)
  },
})

export const { salir } = usuarioSlice.actions

export default usuarioSlice.reducer
