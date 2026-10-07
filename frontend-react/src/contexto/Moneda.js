import { createContext } from 'react'

// Los precios de los datos están en dólares. Para mostrarlos en pesos se multiplican por esto.
export const PESOS_POR_DOLAR = 1500

// Contexto con la moneda elegida ('ARS' | 'USD'). App la guarda en su estado y la comparte
// con todos los componentes, así no hay que pasarla por props uno por uno.
export const ContextoMoneda = createContext('ARS')

// Convierte un precio en dólares al texto que se muestra, según la moneda elegida
export const formatearPrecio = (dolares, moneda) => {
  if (moneda === 'USD') {
    return `US$ ${dolares.toLocaleString('es-AR')}`
  }
  return `$ ${(dolares * PESOS_POR_DOLAR).toLocaleString('es-AR')}`
}
