export const URL_BASE = '/api'

const mensajeDeError = (estado, datos) => {
  if (datos && datos.mensaje) return datos.mensaje
  if (estado === 401 || estado === 403) return 'Necesitás iniciar sesión (o no tenés permiso) para hacer esto'
  if (estado >= 500) return 'El servidor no responde. Revisá que el backend esté levantado'
  return `El pedido falló (error ${estado})`
}

const armarContenido = (cuerpo, archivo) => {
  if (archivo) {
    const formulario = new FormData()
    formulario.append('archivo', archivo, 'foto.jpg')
    return formulario
  }
  if (cuerpo) {
    return JSON.stringify(cuerpo)
  }
  return null
}

const convertir = (texto) => {
  try {
    return texto ? JSON.parse(texto) : null
  } catch {
    return null
  }
}

const interpretar = (respuesta, texto) => {
  const datos = convertir(texto)
  if (!respuesta.ok) {
    const error = new Error(mensajeDeError(respuesta.status, datos))
    error.estado = respuesta.status
    throw error
  }
  return datos
}

export const pedir = (token, ruta, { metodo = 'GET', cuerpo, archivo } = {}) => {
  const encabezados = {}
  if (token) {
    encabezados.Authorization = `Bearer ${token}`
  }
  if (cuerpo && !archivo) {
    encabezados['Content-Type'] = 'application/json'
  }

  return fetch(`${URL_BASE}${ruta}`, { method: metodo, headers: encabezados, body: armarContenido(cuerpo, archivo) })
    .catch(() => {
      throw new Error('No se pudo conectar con el servidor')
    })
    .then((respuesta) => respuesta.text().then((texto) => interpretar(respuesta, texto)))
}

export const pedirLista = (token, ruta) => pedir(token, ruta).then((datos) => datos ?? [])

export const pedirPagina = (token, ruta) => pedir(token, ruta).then((datos) => datos?.content ?? [])
