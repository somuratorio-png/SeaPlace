import { planDe } from '../utils/precios'
import { aAnimal } from './animales'
import { pedir, pedirLista } from './api'

// Todo lo que hace un padrino: planes, muelle, zarpar, sus apadrinamientos y sus favoritos.
// Las funciones que devuelven un plan reciben "planes" (la lista de traerPlanes) para poder
// armarlo completo, con su nombre y su precio para ese animal.

// Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
export const traerPlanes = async () =>
  (await pedirLista('/planes')).map((plan) => ({
    codigo: plan.codigo,
    nombre: plan.nombre,
    multiplicador: plan.multiplicador,
    texto: plan.descripcion,
    ubicacionEnVivo: plan.ubicacionEnVivo,
  }))

// ---------- Muelle ----------

const aItem = (detalle, planes) => {
  const animal = aAnimal(detalle.animal)
  return { animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

// El muelle activo del usuario logueado: { id, items: [{ animal, plan, cantidad }] }.
// Si no tenía uno, el backend lo crea.
export const traerMuelle = async (planes) => {
  const muelle = await pedir('/muelles')
  const detalles = await pedirLista(`/muelles/${muelle.idMuelle}/items`)
  return { id: muelle.idMuelle, items: detalles.map((detalle) => aItem(detalle, planes)) }
}

export const agregarAlMuelle = (idMuelle, idAnimal, codigoPlan) =>
  pedir('/muelles/items', { metodo: 'POST', cuerpo: { idMuelle, idAnimal, cantidad: 1, plan: codigoPlan } })

// Cambia los cupos que se toman de un animal que ya está en el muelle (y, si se indica, su plan)
export const cambiarItem = (idMuelle, idAnimal, cantidad, codigoPlan) =>
  pedir(`/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'PUT', cuerpo: { cantidad, plan: codigoPlan } })

export const quitarDelMuelle = (idMuelle, idAnimal) => pedir(`/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'DELETE' })

// Confirma el muelle: el backend valida los cupos, cobra y crea los apadrinamientos.
// Devuelve { total, idsAnimales } del pago hecho.
export const zarpar = async (idMuelle, conBotiquin) => {
  const respuesta = await pedir('/zarpar', { metodo: 'POST', cuerpo: { idMuelle, conBotiquin } })
  return { total: respuesta.total, idsAnimales: (respuesta.detalles ?? []).map((detalle) => detalle.idAnimal) }
}

// ---------- Apadrinamientos ----------

// usuario = nombre de usuario del padrino. desde y las fechas de los pagos son texto 'AAAA-MM-DD'.
const aApadrinamiento = (dato, planes) => {
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
    pagos: dato.pagos.map((pago) => ({ fecha: pago.fecha.slice(0, 10), monto: pago.monto })),
  }
}

// Los que le corresponden a quien está logueado: un padrino recibe los suyos, un refugio
// los de sus animales y un administrador todos.
export const traerApadrinamientos = async (planes) => (await pedirLista('/apadrinamientos')).map((dato) => aApadrinamiento(dato, planes))

export const cambiarPlan = async (idApadrinamiento, codigoPlan, planes) =>
  aApadrinamiento(await pedir(`/apadrinamientos/${idApadrinamiento}/plan`, { metodo: 'PUT', cuerpo: { plan: codigoPlan } }), planes)

// No lo borra: queda inactivo y sus cupos vuelven a estar disponibles
export const cancelarApadrinamiento = (idApadrinamiento) => pedir(`/apadrinamientos/${idApadrinamiento}`, { metodo: 'DELETE' })

// ---------- Favoritos ----------

// Devuelve los ids de los animales guardados por el usuario logueado
export const traerFavoritos = async () => (await pedirLista('/favoritos')).map((favorito) => favorito.idAnimal)

export const agregarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'PUT' })

export const quitarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'DELETE' })
