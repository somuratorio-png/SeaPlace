import { precioFinal } from './precios'

const pesoUrgencia = { critico: 0, recuperacion: 1, listo: 2 }

export const comparadores = {
  urgencia: (a, b) => pesoUrgencia[a.urgencia] - pesoUrgencia[b.urgencia],
  progreso: (a, b) => a.progreso - b.progreso,
  'precio-menor': (a, b) => precioFinal(a) - precioFinal(b),
  'precio-mayor': (a, b) => precioFinal(b) - precioFinal(a),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre),
}