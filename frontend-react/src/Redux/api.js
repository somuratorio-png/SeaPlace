import axios from 'axios'
import { mensajeDeError } from '../services/api'

// Lo que comparten todos los slices para hablarle al backend con axios.
// /api no existe en el backend: es el prefijo que el proxy de Vite (vite.config.js) reenvía a Spring.
export const URL_BASE = '/api'

// Las opciones de axios con el token de quien inició sesión (o sin encabezado si no hay nadie).
// Ejemplo: const { data } = await axios.get(`${URL_BASE}/apadrinamientos`, conToken(token))
export const conToken = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {})

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
