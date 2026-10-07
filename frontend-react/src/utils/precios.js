import { hoy } from './fechas'

export const PRECIO_BOTIQUIN = 5 // en dólares, como el resto de los precios

// Un animal está en oferta si tiene un descuento que todavía no venció.
// animal.descuento = { porcentaje: 20, hasta: '2026-12-31' }
export const tieneDescuento = (animal) => Boolean(animal.descuento) && animal.descuento.hasta >= hoy()

// La cuota mensual que se cobra de verdad: con el descuento aplicado si está en oferta
export const precioFinal = (animal) => {
  if (!tieneDescuento(animal)) {
    return animal.precio
  }
  return Math.round((animal.precio * (100 - animal.descuento.porcentaje)) / 100)
}

// Los 3 niveles de apadrinamiento. El precio de cada uno sale de la cuota del animal.
export const planesDe = (animal) => {
  const cuota = precioFinal(animal)
  return [
    { nombre: 'Brisa Marina', precio: Math.round(cuota / 2), texto: 'Certificado digital y bitácora mensual por correo.' },
    { nombre: 'Guardián de la Bahía', precio: cuota, texto: 'Todo lo anterior + webcam 24/7 y kit de bienvenida.' },
    { nombre: 'Marea Profunda', precio: cuota * 2, texto: 'Todo lo anterior + ubicación en vivo y charla virtual con los biólogos.', ubicacionEnVivo: true },
  ]
}

export const totalCarrito = (carrito, conBotiquin) => {
  const subtotal = carrito.reduce((suma, item) => suma + item.plan.precio, 0)
  return conBotiquin ? subtotal + PRECIO_BOTIQUIN : subtotal
}

// Suma lo que pagan por mes los apadrinamientos activos de una lista
export const recaudacionMensual = (apadrinamientos) =>
  apadrinamientos.filter((a) => a.activo).reduce((suma, a) => suma + a.plan.precio, 0)
