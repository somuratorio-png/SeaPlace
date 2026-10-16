import { useApadrinamientos } from './useApadrinamientos'

// El apadrinamiento activo de un animal (el id llega como texto desde la URL).
// "item" es undefined si el usuario no lo apadrina: quien lo usa decide a dónde mandarlo.
export const useApadrinamientoDe = (idAnimal) => {
  const { datos, setDatos, cargando, error } = useApadrinamientos()
  const item = datos.find((a) => a.activo && a.animal.id === Number(idAnimal))

  return { item, setApadrinamientos: setDatos, cargando, error }
}