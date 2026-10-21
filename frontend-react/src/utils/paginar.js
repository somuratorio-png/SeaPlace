export const paginar = (lista, pagina, tamanio) => {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / tamanio))
  const paginaActual = Math.min(pagina, totalPaginas - 1)
  const inicio = paginaActual * tamanio

  return { items: lista.slice(inicio, inicio + tamanio), paginaActual, totalPaginas, total: lista.length }
}
