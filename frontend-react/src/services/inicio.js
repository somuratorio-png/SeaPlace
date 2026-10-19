import { aPlanes } from './apadrinar'
import { pedir } from './api'
import { aSesion } from './usuarios'

// Lo que App pide al abrir la página, porque hace falta en cualquier pantalla: { planes, sesion }.
// Al abrir la página todavía no hay nadie logueado (el token vive en memoria y se pierde al recargar),
// así que el pedido va sin token y sesion llega en null.
// Los listados (animales, categorías, apadrinamientos...) los pide cada pantalla.
export const traerInicio = () =>
  pedir(null, '/inicio').then((datos) => {
    // Los planes se guardan primero: hacen falta para armar los ítems del muelle
    const planes = aPlanes(datos.planes)
    return { planes, sesion: datos.sesion ? aSesion(planes, datos.sesion) : null }
  })
