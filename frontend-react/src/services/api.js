// Único lugar que sabe cómo hablarle al backend. El resto de los servicios usa "pedir".
// /api no existe en el backend: es el prefijo que el proxy de Vite (vite.config.js) reenvía a Spring.
export const URL_BASE = '/api'

const CLAVE_TOKEN = 'seaplace-token'

export const guardarToken = (token) => {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export const borrarToken = () => {
  localStorage.removeItem(CLAVE_TOKEN)
}

export const hayToken = () => localStorage.getItem(CLAVE_TOKEN) !== null

// El backend manda sus errores como { mensaje: '...' }. Si la respuesta no trae uno
// (por ejemplo, cuando falta iniciar sesión), se arma un texto según el código.
const mensajeDeError = (estado, datos) => {
  if (datos && datos.mensaje) return datos.mensaje
  if (estado === 401 || estado === 403) return 'Necesitás iniciar sesión (o no tenés permiso) para hacer esto'
  if (estado >= 500) return 'El servidor no responde. Revisá que el backend esté levantado'
  return `El pedido falló (error ${estado})`
}

// Hace un pedido al backend y devuelve el cuerpo de la respuesta ya convertido de JSON,
// o null si la respuesta no trae cuerpo (el backend responde 204 cuando una lista está vacía).
// Si hay un token guardado (alguien inició sesión), lo manda en el encabezado Authorization.
// "cuerpo" viaja como JSON; "archivo" viaja como formulario (para subir una foto).
// Si el pedido sale mal lanza un Error con el mensaje del backend y el código en error.estado.
// Ejemplo: pedir('/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } })
export const pedir = async (ruta, { metodo = 'GET', cuerpo, archivo } = {}) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  const encabezados = {}
  if (token) {
    encabezados.Authorization = `Bearer ${token}`
  }

  let contenido
  if (archivo) {
    // Con FormData el navegador arma solo el encabezado Content-Type
    contenido = new FormData()
    contenido.append('archivo', archivo, 'foto.jpg')
  } else if (cuerpo) {
    encabezados['Content-Type'] = 'application/json'
    contenido = JSON.stringify(cuerpo)
  }

  let respuesta
  try {
    respuesta = await fetch(URL_BASE + ruta, { method: metodo, headers: encabezados, body: contenido })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const texto = await respuesta.text()
  let datos = null
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    // Si el backend está caído, el proxy contesta con texto que no es JSON
  }

  if (!respuesta.ok) {
    const error = new Error(mensajeDeError(respuesta.status, datos))
    error.estado = respuesta.status
    throw error
  }
  return datos
}

// Para los pedidos que devuelven una lista: sin elementos el backend responde 204, y acá se devuelve []
export const pedirLista = async (ruta) => (await pedir(ruta)) ?? []

// Para los que devuelven una página de Spring ({ content: [...], totalPages, ... }): devuelve sus elementos.
// Sin page ni size el backend manda todo en una sola página.
export const pedirPagina = async (ruta) => (await pedir(ruta))?.content ?? []
