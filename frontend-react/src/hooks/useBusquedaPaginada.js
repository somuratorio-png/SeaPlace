import { useState } from 'react'
import { paginar } from '../utils/paginar'
import { paraBuscar } from '../utils/texto'

export const useBusquedaPaginada = (lista, textoDe, tamanio) => {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  const texto = paraBuscar(busqueda)
  const encontrados = lista.filter((elemento) => paraBuscar(textoDe(elemento)).includes(texto))
  const { items, paginaActual, totalPaginas } = paginar(encontrados, pagina, tamanio)

  const buscar = (valor) => {
    setBusqueda(valor)
    setPagina(0)
  }

  return { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina }
}