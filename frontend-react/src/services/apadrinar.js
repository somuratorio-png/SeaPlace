import { planDe } from '../utils/precios'
import { aAnimal, aNovedad, aUbicacion } from './animales'

// Conversores de lo que hace un padrino: planes, muelle y apadrinamientos.
// No le hablan al backend: los pedidos los hacen los slices de src/Redux con axios.
// Los planes hacen falta para armar el plan completo (con su nombre y su precio para ese animal) de cada ítem
// del muelle y de cada apadrinamiento: por eso las funciones de abajo los reciben como primer parámetro.

// Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
export const aPlanes = (lista) =>
  lista.map((plan) => ({
    codigo: plan.codigo,
    nombre: plan.nombre,
    multiplicador: plan.multiplicador,
    texto: plan.descripcion,
    ubicacionEnVivo: plan.ubicacionEnVivo,
  }))

// Un ítem del muelle: { idMuelle, animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
export const aItem = (planes, detalle) => {
  const animal = aAnimal(detalle.animal)
  return { idMuelle: detalle.idMuelle, animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

// usuario = nombre de usuario del padrino. desde y las fechas de los pagos son texto 'AAAA-MM-DD'.
// novedades = la bitácora del animal, de la más nueva a la más vieja. ultimaUbicacion = la última
// posición que informó el refugio, o null si nunca informó una.
export const aApadrinamiento = (planes, dato) => {
  const animal = aAnimal(dato.animal)
  return {
    id: dato.idApadrinamiento,
    usuario: dato.nombreUsuario,
    nombrePadrino: dato.nombrePadrino,
    animal,
    plan: planDe(animal, planes, dato.plan),
    cupos: dato.cupos,
    desde: dato.fechaInicio.slice(0, 10),
    activo: dato.activo,
    pagos: dato.pagos.map((pago) => ({ id: pago.idPago, fecha: pago.fecha.slice(0, 10), monto: pago.monto })),
    novedades: (dato.novedades || []).map(aNovedad),
    ultimaUbicacion: dato.ultimaUbicacion ? aUbicacion(dato.ultimaUbicacion) : null,
  }
}
