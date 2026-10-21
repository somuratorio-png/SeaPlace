import { aPlanes } from './apadrinar'
import { pedir } from './api'
import { aSesion } from './usuarios'

export const traerInicio = () =>
  pedir(null, '/inicio').then((datos) => {
    const planes = aPlanes(datos.planes)
    return { planes, sesion: datos.sesion ? aSesion(planes, datos.sesion) : null }
  })
