import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as animales from '../Redux/animalesSlice'
import { intentar } from '../utils/intentar'
import { validarAnimalNuevo } from '../utils/validaciones'

// Las acciones del panel del refugio: cada una despacha la acción de animalesSlice y, con lo que contesta
// el backend, el estado global se actualiza solo (el cambio se ve sin volver a pedir la lista).
// Si una acción falla, su mensaje queda en errorAccion. "propios" son los animales de este refugio.
// Lo que se pide al montarse (publicaciones, apadrinamientos y categorías) lo despacha PanelRefugio.
export const useGestionRefugio = (propios) => {
  const dispatch = useDispatch()
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // Sube las fotos de a una y en orden: cada una espera a que termine la anterior.
  // Cada vez que el backend guarda una, el animal se actualiza en pantalla con esa foto.
  // Devuelve una promesa con el mensaje de error, o null si se subieron todas.
  const subirFotos = (animal, archivos) =>
    archivos.reduce(
      (anterior, archivo) =>
        anterior.then((resultado) => {
          // Si una falló, las que siguen ya no se suben
          if (resultado.error) {
            return resultado
          }
          return dispatch(animales.subirFoto({ animal: resultado.payload, archivo }))
        }),
      Promise.resolve({ payload: animal }),
    ).then((resultado) => (resultado.error ? resultado.error.message : null))

  // Revisa lo básico, publica el animal y después le sube las fotos elegidas.
  // Devuelve una promesa con un mensaje de error (lo muestra el formulario), o null si salió bien.
  const publicar = (datos, fotos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }

    return dispatch(animales.crearAnimal(datos)).then((accion) => {
      if (accion.error) {
        return accion.error.message
      }
      return subirFotos(accion.payload, fotos)
    })
  }

  // Corrige los datos de un animal ya publicado, con las mismas reglas que al publicarlo.
  // Devuelve una promesa con el mensaje de error (lo muestra el formulario), o null si salió bien.
  const guardarDatos = (idAnimal, datos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }
    return intentar(dispatch(animales.editarAnimal({ idAnimal, datos })))
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitar = (idAnimal) => {
    setErrorAccion(null)
    intentar(dispatch(animales.quitarAnimal(idAnimal)), setErrorAccion)
  }

  // "cambios" trae lo que se modifica, y cada cosa va a su propio endpoint:
  // { descuento: { porcentaje, hasta } } pone una oferta y { descuento: null } la quita,
  // { fotos: [...] } sube los archivos de fotos nuevos (tal como vienen del <input type="file">)
  // y { publicacion: 'PAUSADA' | 'ACTIVA' } pausa o republica.
  const editar = (idAnimal, cambios) => {
    const animal = propios.find((a) => a.id === idAnimal)
    setErrorAccion(null)

    if (cambios.fotos) {
      subirFotos(animal, cambios.fotos).then(setErrorAccion)
      return
    }

    const elegirAccion = () => {
      if (cambios.descuento) {
        return animales.ponerOferta({ animal, porcentaje: cambios.descuento.porcentaje, hasta: cambios.descuento.hasta })
      }
      if (cambios.descuento === null) {
        return animales.quitarOferta(animal)
      }
      return animales.cambiarPublicacion({ idAnimal, estado: cambios.publicacion })
    }
    intentar(dispatch(elegirAccion()), setErrorAccion)
  }

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien
  const publicarNovedad = (idAnimal, texto) => intentar(dispatch(animales.publicarNovedad({ idAnimal, texto })), setErrorAccion)

  const registrarUbicacion = (idAnimal, latitud, longitud) => intentar(dispatch(animales.registrarUbicacion({ idAnimal, latitud, longitud })), setErrorAccion)

  const cerrarErrorAccion = () => {
    setErrorAccion(null)
  }

  return { errorAccion, cerrarErrorAccion, publicar, quitar, editar, guardarDatos, publicarNovedad, registrarUbicacion }
}
