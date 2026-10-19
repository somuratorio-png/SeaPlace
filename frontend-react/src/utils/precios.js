import { hoy } from './fechas'

export const PRECIO_BOTIQUIN = 5 // en dólares, como el resto de los precios (el backend suma lo mismo al total)

// Los precios se redondean a dos decimales, igual que hace el backend al cobrar
const redondear = (valor) => Math.round(valor * 100) / 100

// Un animal está en oferta si tiene un descuento que todavía no venció.
// animal.descuento = { id, porcentaje: 20, hasta: '2026-12-31' }
export const tieneDescuento = (animal) => Boolean(animal.descuento) && animal.descuento.hasta >= hoy()

// Un precio con el descuento del animal aplicado, si está en oferta
const conDescuento = (animal, precio) => {
  if (!tieneDescuento(animal)) {
    return precio
  }
  return redondear((precio * (100 - animal.descuento.porcentaje)) / 100)
}

// La cuota mensual que se cobra de verdad (la del catálogo): con el descuento aplicado si está en oferta
export const precioFinal = (animal) => conDescuento(animal, animal.precio)

// Los niveles de apadrinamiento de un animal. "planes" es la lista que manda el backend
// (ver contexto/Planes.js); a cada uno se le agrega su precio para este animal, que eligió el refugio
// (con el descuento, si está en oferta). Si el backend no lo mandó, sale de la cuota y el multiplicador del plan.
export const planesDe = (animal, planes) =>
  planes.map((plan) => ({ ...plan, precio: conDescuento(animal, animal.preciosPorPlan?.[plan.codigo] ?? redondear(animal.precio * plan.multiplicador)) }))

// Un solo plan, buscado por su código (por ejemplo 'MAREA_PROFUNDA')
export const planDe = (animal, planes, codigo) => planesDe(animal, planes).find((plan) => plan.codigo === codigo)

export const totalMuelle = (muelle, conBotiquin) => {
  // Cada item cuesta la cuota del plan por la cantidad de cupos elegida
  const subtotal = muelle.reduce((suma, item) => suma + item.plan.precio * item.cantidad, 0)
  return conBotiquin ? subtotal + PRECIO_BOTIQUIN : subtotal
}

// Suma lo que pagan por mes los apadrinamientos activos de una lista
export const recaudacionMensual = (apadrinamientos) =>
  apadrinamientos.filter((a) => a.activo).reduce((suma, a) => suma + a.plan.precio * a.cupos, 0)
