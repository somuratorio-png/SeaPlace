import { animalesEjemplo, buscarEjemplo } from '../data/animales'
import { esperar } from './mock'

// Catálogo MOCKEADO: devuelve los animales de data/animales.js con una pequeña demora,
// como si vinieran de un servidor.

export async function getAnimales() {
  await esperar()
  return animalesEjemplo
}

export async function getAnimal(id) {
  await esperar(200)
  const animal = buscarEjemplo(id)
  if (!animal) throw new Error('No existe un animal con ese identificador')
  return animal
}
