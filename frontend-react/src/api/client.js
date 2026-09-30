// Único lugar donde se habla con el backend.
// Todas las llamadas pasan por apiFetch, que:
//   1. antepone /api (Vite lo redirige a Spring, ver vite.config.js)
//   2. agrega el token JWT si el usuario está logueado
//   3. convierte las respuestas de error de Spring ({ mensaje: "..." }) en excepciones

import { getToken } from './tokenStorage'

export class ApiError extends Error {
  constructor(status, mensaje) {
    super(mensaje)
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch solo tira excepción si ni siquiera hubo respuesta (red caída)
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  // 204 No Content: no hay JSON para leer
  if (response.status === 204) return null

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // El GlobalExceptionHandler de Spring manda { status, mensaje, ... }
    const mensaje = data?.mensaje ?? `Error ${response.status} del servidor`
    throw new ApiError(response.status, mensaje)
  }
  return data
}
