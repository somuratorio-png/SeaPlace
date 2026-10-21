import { useApadrinamientos } from './useApadrinamientos'

export const useApadrinamientoDe = (idAnimal) => {
  const { datos, setDatos, cargando, error } = useApadrinamientos()
  const item = datos.find((a) => a.activo && a.animal.id === Number(idAnimal))

  return { item, setApadrinamientos: setDatos, cargando, error }
}