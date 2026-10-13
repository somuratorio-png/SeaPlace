import { aAnimal, aCategoria } from './animales'
import { guardarPlanes } from './apadrinar'
import { pedir } from './api'
import { aSesion } from './usuarios'

// El único GET de la app. Se pide al abrir la página y trae todo: { animales, categorias, planes, sesion }.
// animales son las publicaciones activas (el catálogo). Si una lista está vacía el backend no manda
// ese campo, y acá se devuelve [].
// sesion son los datos de quien está logueado (ver aSesion), o null si no había un token guardado
// o ya no sirve.
export const traerInicio = () =>
  pedir('/inicio').then((datos) => {
    // Los planes se guardan primero: hacen falta para armar los ítems del muelle y los apadrinamientos
    const planes = guardarPlanes(datos.planes)
    return {
      animales: (datos.animales ?? []).map(aAnimal),
      categorias: (datos.categorias ?? []).map(aCategoria),
      planes,
      sesion: datos.sesion ? aSesion(datos.sesion) : null,
    }
  })
