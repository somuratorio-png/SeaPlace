import { aPlanes } from './apadrinar'
import { pedir } from './api'
import { aSesion } from './usuarios'

// Lo que App pide al abrir la página, porque hace falta en cualquier pantalla: { planes, sesion }.
// sesion son los datos de quien está logueado (ver aSesion), o null si no había un token guardado
// o ya no sirve. Los listados (animales, categorías, apadrinamientos...) los pide cada pantalla.
export const traerInicio = () =>
  pedir('/inicio').then((datos) => {
    // Los planes se guardan primero: hacen falta para armar los ítems del muelle
    const planes = aPlanes(datos.planes)
    return { planes, sesion: datos.sesion ? aSesion(planes, datos.sesion) : null }
  })
