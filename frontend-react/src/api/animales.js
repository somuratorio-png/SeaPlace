import { apiFetch } from './client'

// GET /animales  -> devuelve un Page de Spring: { content: [...], totalElements, ... }
export async function getAnimales() {
  const page = await apiFetch('/animales')
  return page?.content ?? []
}

// GET /animales/{id}
export function getAnimal(id) {
  return apiFetch(`/animales/${id}`)
}

// GET /animales/{id}/fotos
export function getFotos(id) {
  return apiFetch(`/animales/${id}/fotos`)
}
