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
