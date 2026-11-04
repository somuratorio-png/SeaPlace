import axios from 'axios'

// Lo que comparten todos los slices para hablarle al backend con axios. Es el único lugar del front
// que sabe cómo hablarle: ningún componente pide nada por su cuenta.
// /api no existe en el backend: es el prefijo que el proxy de Vite (vite.config.js) reenvía a Spring.
export const URL_BASE = '/api'

// El backend manda sus errores como { mensaje: '...' }. Si la respuesta no trae uno
// (por ejemplo, cuando falta iniciar sesión), se arma un texto según el código.
const mensajeDeError = (estado, datos) => {
  if (datos && datos.mensaje) return datos.mensaje
  if (estado === 401 || estado === 403) return 'Necesitás iniciar sesión (o no tenés permiso) para hacer esto'
  if (estado >= 500) return 'El servidor no responde. Revisá que el backend esté levantado'
  return `El pedido falló (error ${estado})`
}

// Las opciones de axios con el token de quien inició sesión, que vive en el estado global (usuarioSlice).
// Si no hay nadie, el pedido va sin encabezado. getState lo recibe cada thunk en su segundo parámetro.
// Ejemplo: const { data } = await axios.get(`${URL_BASE}/apadrinamientos`, conToken(getState))
export const conToken = (getState) => {
  const { token } = getState().usuario
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}

// Los planes que hacen falta para armar los ítems del muelle y los apadrinamientos (ver planesSlice)
export const planesDe = (getState) => getState().planes.items

// Si un pedido falla, axios rechaza la promesa con un mensaje genérico ("Request failed with status code 404").
// Acá se lo reemplaza por el que manda el backend ({ mensaje: '...' }), así el "rejected" de cada slice
// guarda en action.error.message un texto que se puede mostrar tal cual.
axios.interceptors.response.use(
  (respuesta) => respuesta,
  (falla) => {
    falla.message = falla.response ? mensajeDeError(falla.response.status, falla.response.data) : 'No se pudo conectar con el servidor'
    return Promise.reject(falla)
  },
)

// Sin elementos el backend responde 204 sin cuerpo (axios deja data en ''): acá queda como []
export const comoLista = (data) => data || []

// Las respuestas paginadas de Spring ({ content: [...], totalPages, ... }): devuelve sus elementos
export const comoPagina = (data) => data?.content ?? []
