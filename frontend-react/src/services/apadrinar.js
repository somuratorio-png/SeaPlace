import { planDe } from '../utils/precios'
import { aAnimal } from './animales'
import { pedir, pedirLista } from './api'

// Todo lo que hace un padrino: planes, muelle, zarpar, sus apadrinamientos y sus favoritos.

// Los planes se piden una sola vez, al abrir la app (traerPlanes), y quedan guardados acá: hacen
// falta para armar el plan completo (con su nombre y su precio para ese animal) de cada ítem del
// muelle y de cada apadrinamiento.
let planes = []

// Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
export const traerPlanes = () =>
  pedirLista('/planes').then((lista) => {
    planes = lista.map((plan) => ({
      codigo: plan.codigo,
      nombre: plan.nombre,
      multiplicador: plan.multiplicador,
      texto: plan.descripcion,
      ubicacionEnVivo: plan.ubicacionEnVivo,
    }))
    return planes
  })

// ---------- Muelle ----------

// Un ítem del muelle: { animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
const aItem = (detalle) => {
  const animal = aAnimal(detalle.animal)
  return { animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

// El muelle activo del usuario logueado: { id, items: [{ animal, plan, cantidad }] }.
// Si no tenía uno, el backend lo crea.
// Primero se pide el muelle y, con su id, sus ítems.
export const traerMuelle = () =>
  pedir('/muelles').then((muelle) => pedirLista(`/muelles/${muelle.idMuelle}/items`).then((detalles) => ({ id: muelle.idMuelle, items: detalles.map(aItem) })))

// Las dos que siguen devuelven el ítem como quedó guardado, para ponerlo en el estado sin volver a pedir el muelle

export const agregarAlMuelle = (idMuelle, idAnimal, codigoPlan) =>
  pedir('/muelles/items', { metodo: 'POST', cuerpo: { idMuelle, idAnimal, cantidad: 1, plan: codigoPlan } }).then(aItem)

// Cambia los cupos que se toman de un animal que ya está en el muelle (y, si se indica, su plan)
export const cambiarItem = (idMuelle, idAnimal, cantidad, codigoPlan) =>
  pedir(`/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'PUT', cuerpo: { cantidad, plan: codigoPlan } }).then(aItem)

export const quitarDelMuelle = (idMuelle, idAnimal) => pedir(`/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'DELETE' })

// Confirma el muelle: el backend valida los cupos, cobra y crea los apadrinamientos.
// Devuelve el total que se pagó.
export const zarpar = (idMuelle, conBotiquin) => pedir('/zarpar', { metodo: 'POST', cuerpo: { idMuelle, conBotiquin } }).then((respuesta) => respuesta.total)

// ---------- Apadrinamientos ----------

// usuario = nombre de usuario del padrino. desde y las fechas de los pagos son texto 'AAAA-MM-DD'.
const aApadrinamiento = (dato) => {
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
  }
}

// Los que le corresponden a quien está logueado: un padrino recibe los suyos, un refugio
// los de sus animales y un administrador todos.
export const traerApadrinamientos = () => pedirLista('/apadrinamientos').then((datos) => datos.map(aApadrinamiento))

// Las dos que siguen devuelven el apadrinamiento como quedó

export const cambiarPlan = (idApadrinamiento, codigoPlan) =>
  pedir(`/apadrinamientos/${idApadrinamiento}/plan`, { metodo: 'PUT', cuerpo: { plan: codigoPlan } }).then(aApadrinamiento)

// No lo borra: queda inactivo y sus cupos vuelven a estar disponibles (su animal ya viene con los cupos nuevos)
export const cancelarApadrinamiento = (idApadrinamiento) => pedir(`/apadrinamientos/${idApadrinamiento}`, { metodo: 'DELETE' }).then(aApadrinamiento)

// ---------- Favoritos ----------

// Devuelve los ids de los animales guardados por el usuario logueado
export const traerFavoritos = () => pedirLista('/favoritos').then((favoritos) => favoritos.map((favorito) => favorito.idAnimal))

export const agregarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'PUT' })

export const quitarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'DELETE' })
