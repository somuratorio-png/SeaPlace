import { planDe } from '../utils/precios'
import { aAnimal, aNovedad, aUbicacion } from './animales'
import { pedir, pedirLista } from './api'
import { conItem } from '../utils/muelle'

// Todo lo que hace un padrino: planes, muelle, zarpar, sus apadrinamientos y sus favoritos.
// El muelle y los favoritos llegan con la sesión (ver aSesion en usuarios.js); los apadrinamientos
// los pide la pantalla que los muestra.

// Los planes llegan una sola vez, con el pedido inicial (ver inicio.js), y los comparte ContextoPlanes.
// Hacen falta para armar el plan completo (con su nombre y su precio para ese animal) de cada ítem del
// muelle y de cada apadrinamiento: por eso las funciones de abajo los reciben como primer parámetro.

// Pasa los planes del backend al formato de las pantallas.
// Los 3 niveles de apadrinamiento: [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]
export const aPlanes = (lista) =>
  lista.map((plan) => ({
    codigo: plan.codigo,
    nombre: plan.nombre,
    multiplicador: plan.multiplicador,
    texto: plan.descripcion,
    ubicacionEnVivo: plan.ubicacionEnVivo,
  }))

// ---------- Muelle ----------

// Un ítem del muelle: { idMuelle, animal, plan, cantidad }. cantidad = cupos que se toman de ese animal.
export const aItem = (planes, detalle) => {
  const animal = aAnimal(detalle.animal)
  return { idMuelle: detalle.idMuelle, animal, plan: planDe(animal, planes, detalle.plan), cantidad: detalle.cantidad }
}

// Las dos que siguen devuelven el ítem como quedó guardado, para ponerlo en el estado sin volver a pedir el muelle

// Con idMuelle en null (después de zarpar el muelle pagado queda cerrado) el backend abre uno nuevo:
// el ítem que devuelve trae su id.
export const agregarAlMuelle = (token, planes, idMuelle, idAnimal, codigoPlan) =>
  pedir(token, '/muelles/items', { metodo: 'POST', cuerpo: { idMuelle, idAnimal, cantidad: 1, plan: codigoPlan } }).then((detalle) => aItem(planes, detalle))

// Cambia los cupos que se toman de un animal que ya está en el muelle (y, si se indica, su plan)
export const cambiarItem = (token, planes, idMuelle, idAnimal, cantidad, codigoPlan) =>
  pedir(token, `/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'PUT', cuerpo: { cantidad, plan: codigoPlan } }).then((detalle) => aItem(planes, detalle))

// Pone el animal en ese muelle y devuelve una promesa con el muelle como queda.
// Si el animal ya estaba, solo se le cambia el plan (conserva los cupos elegidos).
// Al zarpar, el muelle que se pagó queda cerrado (id en null): el backend abre el siguiente al
// agregarle el primer animal, y el ítem que devuelve trae el id del muelle.
export const ponerEnElMuelle = (token, planes, muelleActual, idAnimal, codigoPlan) => {
  const yaEstaba = muelleActual.items.find((item) => item.animal.id === idAnimal)
  const pedido = yaEstaba
    ? cambiarItem(token, planes, muelleActual.id, idAnimal, yaEstaba.cantidad, codigoPlan)
    : agregarAlMuelle(token, planes, muelleActual.id, idAnimal, codigoPlan)
  return pedido.then((item) => conItem({ ...muelleActual, id: item.idMuelle }, item))
}

export const quitarDelMuelle = (token, idMuelle, idAnimal) => pedir(token, `/muelles/${idMuelle}/items/${idAnimal}`, { metodo: 'DELETE' })

// Confirma el muelle: el backend valida los cupos, cobra y crea los apadrinamientos.
// Devuelve el total que se pagó.
export const zarpar = (token, idMuelle, conBotiquin) => pedir(token, '/zarpar', { metodo: 'POST', cuerpo: { idMuelle, conBotiquin } }).then((respuesta) => respuesta.total)

// ---------- Apadrinamientos ----------

// usuario = nombre de usuario del padrino. desde y las fechas de los pagos son texto 'AAAA-MM-DD'.
// novedades = la bitácora del animal, de la más nueva a la más vieja. ultimaUbicacion = la última
// posición que informó el refugio, o null si nunca informó una.
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

// Los que le corresponden a quien está logueado: un padrino recibe los suyos, un refugio
// los de sus animales y un administrador todos.
export const traerApadrinamientos = (token, planes) => pedirLista(token, '/apadrinamientos').then((datos) => datos.map((dato) => aApadrinamiento(planes, dato)))

// Las dos que siguen devuelven el apadrinamiento como quedó

export const cambiarPlan = (token, planes, idApadrinamiento, codigoPlan) =>
  pedir(token, `/apadrinamientos/${idApadrinamiento}/plan`, { metodo: 'PUT', cuerpo: { plan: codigoPlan } }).then((dato) => aApadrinamiento(planes, dato))

// No lo borra: queda inactivo y sus cupos vuelven a estar disponibles (su animal ya viene con los cupos nuevos)
export const cancelarApadrinamiento = (token, planes, idApadrinamiento) =>
  pedir(token, `/apadrinamientos/${idApadrinamiento}`, { metodo: 'DELETE' }).then((dato) => aApadrinamiento(planes, dato))

// ---------- Favoritos ----------

// Los favoritos del usuario llegan con la sesión (ver aSesion en usuarios.js)

// Devuelve el animal que quedó guardado, para sumarlo al estado sin volver a pedir la lista
export const agregarFavorito = (token, idAnimal) => pedir(token, `/favoritos/${idAnimal}`, { metodo: 'PUT' }).then((favorito) => aAnimal(favorito.animal))

export const quitarFavorito = (token, idAnimal) => pedir(token, `/favoritos/${idAnimal}`, { metodo: 'DELETE' })
