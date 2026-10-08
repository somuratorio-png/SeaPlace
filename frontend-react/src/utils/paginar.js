// Devuelve solo la "página" pedida de una lista, para no mostrar todo junto.
// Se usa sobre listas que ya llegaron completas del backend y que la pantalla filtra y ordena.
// La primera página es la 0, igual que en el backend.
export const paginar = (lista, pagina, tamanio) => {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / tamanio))
  // Si la lista se achicó (por un filtro), no se puede quedar en una página que ya no existe
  const paginaActual = Math.min(pagina, totalPaginas - 1)
  const inicio = paginaActual * tamanio

  return { items: lista.slice(inicio, inicio + tamanio), paginaActual, totalPaginas, total: lista.length }
}
