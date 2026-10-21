import { hoy } from './fechas'

export const PRECIO_BOTIQUIN = 5

const redondear = (valor) => Math.round(valor * 100) / 100

export const tieneDescuento = (animal) => Boolean(animal.descuento) && animal.descuento.hasta >= hoy()

const conDescuento = (animal, precio) => {
  if (!tieneDescuento(animal)) {
    return precio
  }
  return redondear((precio * (100 - animal.descuento.porcentaje)) / 100)
}

export const precioFinal = (animal) => conDescuento(animal, animal.precio)

export const planesDe = (animal, planes) =>
  planes.map((plan) => ({ ...plan, precio: conDescuento(animal, animal.preciosPorPlan?.[plan.codigo] ?? redondear(animal.precio * plan.multiplicador)) }))

export const planDe = (animal, planes, codigo) => planesDe(animal, planes).find((plan) => plan.codigo === codigo)

export const totalMuelle = (muelle, conBotiquin) => {
  const subtotal = muelle.reduce((suma, item) => suma + item.plan.precio * item.cantidad, 0)
  return conBotiquin ? subtotal + PRECIO_BOTIQUIN : subtotal
}

export const recaudacionMensual = (apadrinamientos) =>
  apadrinamientos.filter((a) => a.activo).reduce((suma, a) => suma + a.plan.precio * a.cupos, 0)
