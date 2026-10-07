// Las fechas se guardan como texto 'AAAA-MM-DD', que se puede comparar y ordenar directamente

export const hoy = () => new Date().toISOString().slice(0, 10)

// '2026-10-07' -> '07/10/2026'
export const formatearFecha = (fecha) => fecha.split('-').reverse().join('/')
