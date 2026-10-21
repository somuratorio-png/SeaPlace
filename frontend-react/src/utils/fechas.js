export const hoy = () => new Date().toISOString().slice(0, 10)

export const formatearFecha = (fecha) => fecha.split('-').reverse().join('/')
