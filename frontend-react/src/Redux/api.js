// Lo que comparten todos los slices para hablarle al backend con axios. Es el único lugar del front
// que sabe cómo hablarle: ningún componente pide nada por su cuenta.
// /api no existe en el backend: es el prefijo que el proxy de Vite (vite.config.js) reenvía a Spring.
export const URL_BASE = '/api'

// Las opciones de axios con el token de quien inició sesión, que vive en el estado global (usuarioSlice).
// Si no hay nadie, el pedido va sin encabezado. getState lo recibe cada thunk en su segundo parámetro.
// Ejemplo: const { data } = await axios.get(`${URL_BASE}/apadrinamientos`, conToken(getState))
export const conToken = (getState) => {
  const { token } = getState().usuario
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
}

// Los planes que hacen falta para armar los ítems del muelle y los apadrinamientos (ver planesSlice)
export const planesDe = (getState) => getState().planes.items

// Sin elementos el backend responde 204 sin cuerpo (axios deja data en ''): acá queda como []
export const comoLista = (data) => data || []

// Las respuestas paginadas de Spring ({ content: [...], totalPages, ... }): devuelve sus elementos
export const comoPagina = (data) => (data && data.content) || []

// Lo que le llega a rejectWithValue cuando un pedido falla: siempre un objeto con "mensaje".
// Si el backend respondió sin cuerpo (por ejemplo un 401/403 de Spring Security, o un 500 del proxy de
// Vite mientras Spring se reinicia) error.response.data viene vacío; sin esto a la pantalla llegaba el
// texto genérico de Redux Toolkit, "Rejected".
export const conError = (error) => {
  if (!error.response) return { mensaje: 'No se pudo conectar con el servidor' }
  const { status, data } = error.response
  if (data && data.mensaje) return data
  if (status === 401 || status === 403) return { mensaje: 'No tenés permiso para esto o tu sesión venció: volvé a iniciar sesión' }
  if (status >= 500) return { mensaje: `El servidor no pudo responder (error ${status}). Fijate que el backend esté levantado` }
  return { mensaje: `El servidor respondió con un error (${status})` }
}
