import { useState } from 'react'
import * as animalesApi from '../services/animales'
import { intentar } from '../utils/intentar'
import { ponerEn, sacarDe } from '../utils/listas'
import { validarAnimalNuevo } from '../utils/validaciones'
import { useSesion } from './useSesion'
import { useConsulta } from './useConsulta'
import { useApadrinamientos } from './useApadrinamientos'

// Todo lo que necesita el panel del refugio: lo que pide al backend al montarse (las publicaciones de este
// refugio, sus apadrinamientos y las categorías, un pedido por lista) y las acciones que cambian los datos.
// Cada acción llama al backend y, con lo que contesta, actualiza el estado: el cambio se ve sin volver
// a pedir la lista. Si una acción falla, su mensaje queda en errorAccion.
export const useGestionRefugio = () => {
  const { usuario } = useSesion()
  const { datos: animales, setDatos: setAnimales, cargando, error: errorAnimales } = useConsulta(animalesApi.traerPublicaciones, usuario.idRefugio, [])
  const { datos: todos, error: errorApadrinamientos } = useApadrinamientos()
  const { datos: categorias, error: errorCategorias } = useConsulta(animalesApi.traerCategorias, undefined, [])
  const error = errorAnimales ?? errorApadrinamientos ?? errorCategorias
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // Pone en la lista al animal como lo devolvió el backend
  const guardarAnimal = (animal) => {
    setAnimales((actuales) => ponerEn(actuales, animal))
  }

  const propios = animales.filter((animal) => animal.idRefugio === usuario.idRefugio)

  // Apadrinamientos activos de los animales de este refugio
  const apadrinamientos = todos.filter((a) => a.activo && a.animal.idRefugio === usuario.idRefugio)

  // Sube las fotos de a una y en orden: cada una espera a que termine la anterior.
  // Cada vez que el backend guarda una, el animal se actualiza en pantalla con esa foto.
  const subirFotos = (animal, archivos) =>
    archivos.reduce(
      (anterior, archivo) =>
        anterior
          .then((actual) => animalesApi.subirFoto(actual, archivo))
          .then((conFoto) => {
            guardarAnimal(conFoto)
            return conFoto
          }),
      Promise.resolve(animal),
    )

  // Revisa lo básico, publica el animal y después le sube las fotos elegidas.
  // Devuelve una promesa con un mensaje de error (lo muestra el formulario), o null si salió bien.
  const publicar = (datos, fotos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }

    return intentar(
      animalesApi.crearAnimal(datos).then((nuevo) => {
        guardarAnimal(nuevo)
        return subirFotos(nuevo, fotos)
      }),
    )
  }

  // Corrige los datos de un animal ya publicado, con las mismas reglas que al publicarlo.
  // Devuelve una promesa con el mensaje de error (lo muestra el formulario), o null si salió bien.
  const guardarDatos = (idAnimal, datos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }
    return intentar(animalesApi.editarAnimal(idAnimal, datos).then(guardarAnimal))
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitar = (idAnimal) => {
    setErrorAccion(null)
    animalesApi
      .quitarAnimal(idAnimal)
      .then(() => {
        setAnimales((actuales) => sacarDe(actuales, idAnimal))
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  // "cambios" trae lo que se modifica, y cada cosa va a su propio endpoint:
  // { descuento: { porcentaje, hasta } } pone una oferta y { descuento: null } la quita,
  // { fotos: [...] } sube los archivos de fotos nuevos (tal como vienen del <input type="file">)
  // y { publicacion: 'PAUSADA' | 'ACTIVA' } pausa o republica.
  const editar = (idAnimal, cambios) => {
    const animal = propios.find((a) => a.id === idAnimal)

    const elegirPedido = () => {
      if (cambios.descuento) {
        return animalesApi.ponerOferta(animal, cambios.descuento.porcentaje, cambios.descuento.hasta)
      }
      if (cambios.descuento === null) {
        return animalesApi.quitarOferta(animal)
      }
      if (cambios.fotos) {
        return subirFotos(animal, cambios.fotos)
      }
      return animalesApi.cambiarPublicacion(idAnimal, cambios.publicacion)
    }
    const pedido = elegirPedido()

    setErrorAccion(null)
    pedido.then(guardarAnimal).catch((falla) => {
      setErrorAccion(falla.message)
    })
  }

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien
  const publicarNovedad = (idAnimal, texto) => intentar(animalesApi.publicarNovedad(idAnimal, texto), setErrorAccion)

  const registrarUbicacion = (idAnimal, latitud, longitud) => intentar(animalesApi.registrarUbicacion(idAnimal, latitud, longitud), setErrorAccion)

  const cerrarErrorAccion = () => {
    setErrorAccion(null)
  }

  return { propios, apadrinamientos, categorias, cargando, error, errorAccion, cerrarErrorAccion, publicar, quitar, editar, guardarDatos, publicarNovedad, registrarUbicacion }
}