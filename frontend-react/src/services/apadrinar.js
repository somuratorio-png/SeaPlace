import { planDe } from '../utils/precios'
import { aAnimal, aNovedad, aUbicacion } from './animales'
import { pedir, pedirLista } from './api'

// Todo lo que hace un padrino: planes, muelle, zarpar, sus apadrinamientos y sus favoritos.
// El muelle y los favoritos llegan con la sesión (ver aSesion en usuarios.js); los apadrinamientos
// los pide la pantalla que los muestra.

// Los planes llegan una sola vez, con el pedido inicial (ver inicio.js), y quedan guardados acá: hacen
// falta para armar el plan completo (con su nombre y su precio para ese animal) de cada ítem del
// muelle y de cada apadrinamiento.
let planes = []

// Recibe los planes como los manda el backend, los guarda y los devuelve en el formato de las pantallas.
// Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
export const guardarPlanes = (lista) => {
  planes = lista.map((plan) => ({
    codigo: plan.codigo,
    nombre: plan.nombre,
    multiplicador: plan.multiplicador,
    texto: plan.descripcion,
    ubicacionEnVivo: plan.ubicacionEnVivo,
  }))
  return planes
}

// ---------- Muelle ----------

// Un ítem del muelle: { idMuelle, animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
export const aItem = (detalle) => {
  const animal = aAnimal(detalle.animal)
  return { idMuelle: detalle.idMuelle, animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

// Las dos que siguen devuelven el ítem como quedó guardado, para ponerlo en el estado sin volver a pedir el muelle

// Con idMuelle en null (después de zarpar el muelle pagado queda cerrado) el backend abre uno nuevo:
// el ítem que devuelve trae su id.
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
// novedades = la bitácora del animal, de la más nueva a la más vieja. ultimaUbicacion = la última
// posición que informó el refugio, o null si nunca informó una.
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
    novedades: (dato.novedades ?? []).map(aNovedad),
    ultimaUbicacion: dato.ultimaUbicacion ? aUbicacion(dato.ultimaUbicacion) : null,
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

// Los favoritos del usuario llegan con la sesión (ver aSesion en usuarios.js)

// Devuelve el animal que quedó guardado, para sumarlo al estado sin volver a pedir la lista
export const agregarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'PUT' }).then((favorito) => aAnimal(favorito.animal))

export const quitarFavorito = (idAnimal) => pedir(`/favoritos/${idAnimal}`, { metodo: 'DELETE' })
