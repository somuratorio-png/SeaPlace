import { useState } from 'react'
import * as animalesApi from '../services/animales'
import { intentar } from '../utils/intentar'
import { ponerEn, sacarDe } from '../utils/listas'
import { validarAnimalNuevo } from '../utils/validaciones'
import { useSesion } from './useSesion'
import { useConsulta } from './useConsulta'
import { useApadrinamientos } from './useApadrinamientos'

export const useGestionRefugio = () => {
  const { usuario, token } = useSesion()
  const { datos: animales, setDatos: setAnimales, cargando, error: errorAnimales } = useConsulta(animalesApi.traerPublicaciones, usuario.idRefugio, [])
  const { datos: todos, error: errorApadrinamientos } = useApadrinamientos()
  const { datos: categorias, error: errorCategorias } = useConsulta(animalesApi.traerCategorias, undefined, [])
  const error = errorAnimales ?? errorApadrinamientos ?? errorCategorias
  const [errorAccion, setErrorAccion] = useState(null)

  const guardarAnimal = (animal) => {
    setAnimales((actuales) => ponerEn(actuales, animal))
  }

  const propios = animales.filter((animal) => animal.idRefugio === usuario.idRefugio)

  const apadrinamientos = todos.filter((a) => a.activo && a.animal.idRefugio === usuario.idRefugio)

  const subirFotos = (animal, archivos) =>
    archivos.reduce(
      (anterior, archivo) =>
        anterior
          .then((actual) => animalesApi.subirFoto(token, actual, archivo))
          .then((conFoto) => {
            guardarAnimal(conFoto)
            return conFoto
          }),
      Promise.resolve(animal),
    )

  const publicar = (datos, fotos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }

    return intentar(
      animalesApi.crearAnimal(token, datos).then((nuevo) => {
        guardarAnimal(nuevo)
        return subirFotos(nuevo, fotos)
      }),
    )
  }

  const guardarDatos = (idAnimal, datos) => {
    const errorAnimal = validarAnimalNuevo(datos)
    if (errorAnimal !== null) {
      return Promise.resolve(errorAnimal)
    }
    return intentar(animalesApi.editarAnimal(token, idAnimal, datos).then(guardarAnimal))
  }

  const quitar = (idAnimal) => {
    setErrorAccion(null)
    animalesApi
      .quitarAnimal(token, idAnimal)
      .then(() => {
        setAnimales((actuales) => sacarDe(actuales, idAnimal))
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  const editar = (idAnimal, cambios) => {
    const animal = propios.find((a) => a.id === idAnimal)

    const elegirPedido = () => {
      if (cambios.descuento) {
        return animalesApi.ponerOferta(token, animal, cambios.descuento.porcentaje, cambios.descuento.hasta)
      }
      if (cambios.descuento === null) {
        return animalesApi.quitarOferta(token, animal)
      }
      if (cambios.fotos) {
        return subirFotos(animal, cambios.fotos)
      }
      return animalesApi.cambiarPublicacion(token, idAnimal, cambios.publicacion)
    }
    const pedido = elegirPedido()

    setErrorAccion(null)
    pedido.then(guardarAnimal).catch((falla) => {
      setErrorAccion(falla.message)
    })
  }

  const publicarNovedad = (idAnimal, texto) => intentar(animalesApi.publicarNovedad(token, idAnimal, texto), setErrorAccion)

  const registrarUbicacion = (idAnimal, latitud, longitud) => intentar(animalesApi.registrarUbicacion(token, idAnimal, latitud, longitud), setErrorAccion)

  const cerrarErrorAccion = () => {
    setErrorAccion(null)
  }

  return { propios, apadrinamientos, categorias, cargando, error, errorAccion, cerrarErrorAccion, publicar, quitar, editar, guardarDatos, publicarNovedad, registrarUbicacion }
}