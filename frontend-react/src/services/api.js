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

// El backend manda sus errores como { mensaje: '...' }. Si la respuesta no trae uno
// (por ejemplo, cuando falta iniciar sesión), se arma un texto según el código.
const mensajeDeError = (estado, datos) => {
  if (datos && datos.mensaje) return datos.mensaje
  if (estado === 401 || estado === 403) return 'Necesitás iniciar sesión (o no tenés permiso) para hacer esto'
  if (estado >= 500) return 'El servidor no responde. Revisá que el backend esté levantado'
  return `El pedido falló (error ${estado})`
}

// Lo que viaja en el pedido: "archivo" va como formulario (el navegador arma solo el encabezado
// Content-Type), "cuerpo" va como JSON, y sin ninguno de los dos no viaja nada.
const armarContenido = (cuerpo, archivo) => {
  if (archivo) {
    const formulario = new FormData()
    formulario.append('archivo', archivo, 'foto.jpg')
    return formulario
  }
  if (cuerpo) {
    return JSON.stringify(cuerpo)
  }
  return undefined
}

// Convierte el texto de la respuesta de JSON a datos. Sin texto (204) devuelve null, y también
// si el texto no es JSON (cuando el backend está caído, el proxy contesta con texto suelto).
const convertir = (texto) => {
  try {
    return texto ? JSON.parse(texto) : null
  } catch {
    return null
  }
}

// Con la respuesta ya leída: si salió bien devuelve los datos; si no, lanza el Error con el
// mensaje del backend y el código en error.estado.
const interpretar = (respuesta, texto) => {
  const datos = convertir(texto)
  if (!respuesta.ok) {
    const error = new Error(mensajeDeError(respuesta.status, datos))
    error.estado = respuesta.status
    throw error
  }
  return datos
}

// Hace un pedido al backend y devuelve una promesa con el cuerpo de la respuesta ya convertido de JSON,
// o null si la respuesta no trae cuerpo (el backend responde 204 cuando una lista está vacía).
// Si hay un token guardado (alguien inició sesión), lo manda en el encabezado Authorization.
// "cuerpo" viaja como JSON; "archivo" viaja como formulario (para subir una foto).
// Si el pedido sale mal la promesa se rechaza con un Error con el mensaje del backend y el código en error.estado.
// Ejemplo: pedir('/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } })
export const pedir = (ruta, { metodo = 'GET', cuerpo, archivo } = {}) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  const encabezados = {}
  if (token) {
    encabezados.Authorization = `Bearer ${token}`
  }
  if (cuerpo && !archivo) {
    encabezados['Content-Type'] = 'application/json'
  }

  return fetch(URL_BASE + ruta, { method: metodo, headers: encabezados, body: armarContenido(cuerpo, archivo) })
    .catch(() => {
      // Solo falla acá si no se pudo llegar al servidor (el proxy apagado, sin red)
      throw new Error('No se pudo conectar con el servidor')
    })
    .then((respuesta) => respuesta.text().then((texto) => interpretar(respuesta, texto)))
}

// Para los pedidos que devuelven una lista: sin elementos el backend responde 204, y acá se devuelve []
export const pedirLista = (ruta) => pedir(ruta).then((datos) => datos ?? [])

// Para los que devuelven una página de Spring ({ content: [...], totalPages, ... }): devuelve sus elementos.
// Sin page ni size el backend manda todo en una sola página.
export const pedirPagina = (ruta) => pedir(ruta).then((datos) => datos?.content ?? [])
