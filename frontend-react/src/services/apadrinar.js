import { planDe } from '../utils/precios'
import { aAnimal, aNovedad, aUbicacion } from './animales'
import { pedir, pedirLista } from './api'
import { conItem } from '../utils/muelle'

export const aPlanes = (lista) =>
  lista.map((plan) => ({
    codigo: plan.codigo,
    nombre: plan.nombre,
    multiplicador: plan.multiplicador,
    texto: plan.descripcion,
    ubicacionEnVivo: plan.ubicacionEnVivo,
  }))

export const aItem = (planes, detalle) => {
  const animal = aAnimal(detalle.animal)
  return { idMuelle: detalle.idMuelle, animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

export const agregarAlMuelle = (token, planes, idMuelle, idAnimal, codigoPlan) =>
  pedir(token, '/muelles/items', { metodo: 'POST', cuerpo: { idMuelle, idAnimal, cantidad: 1, plan: codigoPlan } }).then((detalle) => aItem(planes, detalle))

export const cambiarItem = (token, planes, idMuelle, idAnimal, cantidad, codigoPlan) =>
  pedir(token, `/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'PUT', cuerpo: { cantidad, plan: codigoPlan } }).then((detalle) => aItem(planes, detalle))

export const ponerEnElMuelle = (token, planes, muelleActual, idAnimal, codigoPlan) => {
  const yaEstaba = muelleActual.items.find((item) => item.animal.id === idAnimal)
  const pedido = yaEstaba
    ? cambiarItem(token, planes, muelleActual.id, idAnimal, yaEstaba.cantidad, codigoPlan)
    : agregarAlMuelle(token, planes, muelleActual.id, idAnimal, codigoPlan)
  return pedido.then((item) => conItem({ ...muelleActual, id: item.idMuelle }, item))
}

export const quitarDelMuelle = (token, idMuelle, idAnimal) => pedir(token, `/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'DELETE' })

export const zarpar = (token, idMuelle, conBotiquin) => pedir(token, '/zarpar', { metodo: 'POST', cuerpo: { idMuelle, conBotiquin } }).then((respuesta) => respuesta.total)

const aApadrinamiento = (planes, dato) => {
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
    novedades: (dato.novedades ?? []).map(aNovedad),
    ultimaUbicacion: dato.ultimaUbicacion ? aUbicacion(dato.ultimaUbicacion) : null,
  }
}

export const traerApadrinamientos = (token, planes) => pedirLista(token, '/apadrinamientos').then((datos) => datos.map((dato) => aApadrinamiento(planes, dato)))

export const cambiarPlan = (token, planes, idApadrinamiento, codigoPlan) =>
  pedir(token, `/apadrinamientos/${idApadrinamiento}/plan`, { metodo: 'PUT', cuerpo: { plan: codigoPlan } }).then((dato) => aApadrinamiento(planes, dato))

export const cancelarApadrinamiento = (token, planes, idApadrinamiento) =>
  pedir(token, `/apadrinamientos/${idApadrinamiento}`, { metodo: 'DELETE' }).then((dato) => aApadrinamiento(planes, dato))

export const agregarFavorito = (token, idAnimal) => pedir(token, `/favoritos/${idAnimal}`, { metodo: 'PUT' }).then((favorito) => aAnimal(favorito.animal))

export const quitarFavorito = (token, idAnimal) => pedir(token, `/favoritos/${idAnimal}`, { metodo: 'DELETE' })
