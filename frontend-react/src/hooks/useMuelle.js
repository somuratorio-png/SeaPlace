import { useContext } from 'react'
import { ContextoSesion } from '../contexto/Sesion'
import { cambiarItem, ponerEnElMuelle, quitarDelMuelle } from '../services/apadrinar'
import { conItem, SIN_MUELLE } from '../utils/muelle'
import { usePlanes } from './usePlanes'

export const useMuelle = () => {
  const { token, muelle, setMuelle } = useContext(ContextoSesion)
  const planes = usePlanes()

  const agregar = (idAnimal, codigoPlan) => ponerEnElMuelle(token, planes, muelle, idAnimal, codigoPlan).then(setMuelle)

  // La cantidad va de 1 hasta los cupos que le quedan al animal (igual que valida el backend)
  const cambiarCantidad = (item, cantidad) => {
    const acotada = Math.min(item.animal.cuposDisponibles, Math.max(1, cantidad))
    return cambiarItem(token, planes, muelle.id, item.animal.id, acotada).then((cambiado) => {
      setMuelle((actual) => conItem(actual, cambiado))
    })
  }

  const quitar = (item) =>
    quitarDelMuelle(token, muelle.id, item.animal.id).then(() => {
      setMuelle((actual) => ({ ...actual, items: actual.items.filter((otro) => otro.animal.id !== item.animal.id) }))
    })

  const vaciar = () => setMuelle(SIN_MUELLE)

  return { idMuelle: muelle.id, items: muelle.items, agregar, cambiarCantidad, quitar, vaciar }
}