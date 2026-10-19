import { useContext } from 'react'
import { ContextoSesion } from '../contexto/Sesion'
import * as apadrinarApi from '../services/apadrinar'

export const useFavoritos = () => {
  const { token, favoritos, setFavoritos } = useContext(ContextoSesion)

  const esFavorito = (idAnimal) => favoritos.some((guardado) => guardado.id === idAnimal)

  // Devuelve la promesa: quien lo llama decide qué mostrar si el pedido falla
  const alternarFavorito = (animal) =>
    esFavorito(animal.id)
      ? apadrinarApi.quitarFavorito(token, animal.id).then(() => {
          setFavoritos((actuales) => actuales.filter((guardado) => guardado.id !== animal.id))
        })
      : apadrinarApi.agregarFavorito(token, animal.id).then((guardado) => {
          setFavoritos((actuales) => [...actuales, guardado])
        })

  return { favoritos, esFavorito, alternarFavorito }
}