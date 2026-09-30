import { animalesEjemplo, buscarEjemplo } from '../data/animales'
import { esperar } from './mock'

// Catálogo MOCKEADO: devuelve los animales de data/animales.js con una pequeña demora,
// como si vinieran de un servidor.

export const getAnimales = async () => {
  await esperar()
  return animalesEjemplo
}

export const getAnimal = async (id) => {
  await esperar(200)
  const animal = buscarEjemplo(id)
  if (!animal) throw new Error('No existe un animal con ese identificador')
  return animal
}
