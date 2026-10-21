import { createContext } from 'react'

export const PESOS_POR_DOLAR = 1500

export const ContextoMoneda = createContext(null)

export const formatearPrecio = (dolares, moneda) => {
  if (moneda === 'USD') {
    return `US$ ${dolares.toLocaleString('es-AR')}`
  }
  return `$ ${(dolares * PESOS_POR_DOLAR).toLocaleString('es-AR')}`
}

export const aDolares = (valor, moneda) => (moneda === 'USD' ? valor : Math.round((valor / PESOS_POR_DOLAR) * 100) / 100)
