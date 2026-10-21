import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { hoy } from '../utils/fechas'
import { pedir, pedirLista, pedirPagina, URL_BASE } from './api'

const urlDeFoto = (url) => (url.startsWith('/animales/') ? `${URL_BASE}${url}` : url)

const aDescuento = (dato) => ({ id: dato.idDescuento, porcentaje: dato.porcentaje, hasta: dato.fechaFin })

export const aAnimal = (dato) => {
  const urgencia = (dato.urgencia ?? 'RECUPERACION').toLowerCase()
  const fotos = dato.fotos.length > 0 ? dato.fotos.map(urlDeFoto) : [heroFoca]

  return {
    id: dato.idAnimal,
    nombre: dato.nombreAnimal,
    descripcion: dato.descripcion ?? '',
    precio: dato.cuotaApadrinamiento,
    preciosPorPlan: dato.preciosPorPlan ?? {},
    cuposTotales: dato.cuposTotales,
    cuposDisponibles: dato.cuposDisponibles,
    publicacion: dato.estado,
    categoria: dato.idCategoria,
    nombreCategoria: dato.nombreCategoria,
    idRefugio: dato.idRefugio,
    especie: dato.especie ?? dato.nombreCategoria,
    edad: dato.edad ?? 'Sin datos',
    ubicacion: dato.ubicacion ?? dato.nombreRefugio,
    urgencia,
    estado: dato.condicion ?? urgencias.find((u) => u.id === urgencia).estado,
    destacado: dato.destacado,
    cambioPendiente: dato.tieneCambioPendiente ?? false,
    ficha: { especie: dato.especie ?? '', edad: dato.edad ?? '', ubicacion: dato.ubicacion ?? '' },
    progreso: dato.progreso,
    imagen: fotos[0],
    fotos,
    sinFotos: dato.fotos.length === 0,
    descuento: dato.descuento ? aDescuento(dato.descuento) : null,
  }
}

const iconoDe = (nombre) => {
  const texto = nombre.toLowerCase()
  if (texto.includes('nutria')) return 'waves'
  if (texto.includes('cet') || texto.includes('ballena') || texto.includes('delf')) return 'sailing'
  if (texto.includes('tortuga')) return 'shield'
  return 'pets'
}

const aCategoria = (dato) => ({ id: dato.idCategoria, nombre: dato.nombreCategoria, icono: iconoDe(dato.nombreCategoria) })

export const traerCategorias = (token) => pedirLista(token, '/categorias').then((categorias) => categorias.map(aCategoria))

export const crearCategoria = (token, nombreCategoria, descripcion) =>
  pedir(token, '/categorias', { metodo: 'POST', cuerpo: { nombreCategoria, descripcion } }).then(aCategoria)

export const traerAnimales = (token) => pedirPagina(token, '/animales').then((animales) => animales.map(aAnimal))

export const traerAnimal = (token, idAnimal) => pedir(token, `/animales/${idAnimal}`).then(aAnimal)

export const traerPublicaciones = (token, idRefugio) => {
  const filtro = idRefugio ? `&idRefugio=${idRefugio}` : ''
  return pedirPagina(token, `/animales?estado=ACTIVA,PAUSADA,PENDIENTE${filtro}`).then((publicaciones) => publicaciones.map(aAnimal))
}

export const aprobarAnimal = (token, idAnimal) => pedir(token, `/animales/${idAnimal}/aprobar`, { metodo: 'PUT' }).then(aAnimal)

export const rechazarAnimal = (token, idAnimal, motivo) => pedir(token, `/animales/${idAnimal}/rechazar`, { metodo: 'PUT', cuerpo: { motivo } })

export const crearAnimal = (token, datos) =>
  pedir(token, '/animales', {
    metodo: 'POST',
    cuerpo: {
      idCategoria: Number(datos.categoria),
      nombreAnimal: datos.nombre,
      especie: datos.especie,
      edad: datos.edad,
      ubicacion: datos.ubicacion,
      urgencia: datos.urgencia.toUpperCase(),
      condicion: urgencias.find((u) => u.id === datos.urgencia).estado,
      descripcion: datos.descripcion,
      cuotaApadrinamiento: Number(datos.precio),
      precioBrisaMarina: Number(datos.precioBrisa),
      precioMareaProfunda: Number(datos.precioMarea),
      cuposTotales: Number(datos.cuposTotales),
    },
  }).then(aAnimal)

const diferencias = (actual, cambio, nombreCategoriaPropuesta) => {
  const campos = [
    { campo: 'Categoría', antes: actual.nombreCategoria, despues: cambio.idCategoria === actual.idCategoria ? null : nombreCategoriaPropuesta },
    { campo: 'Nombre', antes: actual.nombreAnimal, despues: cambio.nombreAnimal },
    { campo: 'Especie', antes: actual.especie, despues: cambio.especie },
    { campo: 'Salud', antes: actual.condicion, despues: cambio.condicion },
    { campo: 'Edad', antes: actual.edad, despues: cambio.edad },
    { campo: 'Ubicación', antes: actual.ubicacion, despues: cambio.ubicacion },
    { campo: 'Cupos', antes: actual.cuposTotales, despues: cambio.cuposTotales },
    { campo: 'Brisa Marina', antes: actual.preciosPorPlan?.BRISA_MARINA, despues: cambio.precioBrisaMarina, esPrecio: true },
    { campo: 'Guardián de la Bahía', antes: actual.cuotaApadrinamiento, despues: cambio.cuotaApadrinamiento, esPrecio: true },
    { campo: 'Marea Profunda', antes: actual.preciosPorPlan?.MAREA_PROFUNDA, despues: cambio.precioMareaProfunda, esPrecio: true },
    { campo: 'Historia', antes: actual.descripcion, despues: cambio.descripcion },
  ]
  return campos
    .filter((c) => c.despues !== null && c.despues !== undefined && c.despues !== c.antes)
    .map((c) => ({ ...c, antes: c.antes ?? '—', esPrecio: c.esPrecio ?? false }))
}

export const traerCambiosPendientes = (token) =>
  pedirLista(token, '/animales/cambios-pendientes').then((lista) =>
    lista.map((pendiente) => ({ animal: aAnimal(pendiente.animal), cambios: diferencias(pendiente.animal, pendiente.cambio, pendiente.nombreCategoriaPropuesta) })),
  )

export const aprobarCambios = (token, idAnimal) => pedir(token, `/animales/${idAnimal}/cambios/aprobar`, { metodo: 'PUT' }).then(aAnimal)

export const rechazarCambios = (token, idAnimal, motivo) => pedir(token, `/animales/${idAnimal}/cambios/rechazar`, { metodo: 'PUT', cuerpo: { motivo } }).then(aAnimal)

export const editarAnimal = (token, idAnimal, datos) =>
  pedir(token, `/animales/${idAnimal}`, {
    metodo: 'PUT',
    cuerpo: {
      idCategoria: Number(datos.categoria),
      nombreAnimal: datos.nombre,
      especie: datos.especie,
      edad: datos.edad,
      ubicacion: datos.ubicacion,
      urgencia: datos.urgencia.toUpperCase(),
      condicion: urgencias.find((u) => u.id === datos.urgencia).estado,
      descripcion: datos.descripcion,
      cuotaApadrinamiento: Number(datos.precio),
      precioBrisaMarina: Number(datos.precioBrisa),
      precioMareaProfunda: Number(datos.precioMarea),
      cuposTotales: Number(datos.cuposTotales),
    },
  }).then(aAnimal)

export const quitarAnimal = (token, idAnimal) => pedir(token, `/animales/${idAnimal}`, { metodo: 'DELETE' })

export const cambiarPublicacion = (token, idAnimal, estado) => pedir(token, `/animales/${idAnimal}`, { metodo: 'PUT', cuerpo: { estado } }).then(aAnimal)

export const subirFoto = (token, animal, archivo) =>
  pedir(token, `/animales/${animal.id}/fotos/archivo`, { metodo: 'POST', archivo }).then((foto) => {
    const url = urlDeFoto(foto.urlImagen)
    const fotos = animal.sinFotos ? [url] : [...animal.fotos, url]
    return { ...animal, fotos, imagen: fotos[0], sinFotos: false }
  })

export const ponerOferta = (token, animal, porcentaje, hasta) =>
  pedir(token, `/animales/${animal.id}/descuentos`, { metodo: 'POST', cuerpo: { porcentaje, fechaInicio: hoy(), fechaFin: hasta } }).then((descuento) => ({
    ...animal,
    descuento: aDescuento(descuento),
  }))

export const quitarOferta = (token, animal) =>
  pedir(token, `/animales/${animal.id}/descuentos/${animal.descuento.id}`, { metodo: 'DELETE' }).then(() => ({ ...animal, descuento: null }))

export const aNovedad = (novedad) => ({ id: novedad.idNovedad, fecha: novedad.fecha.slice(0, 10), texto: novedad.texto })

export const aUbicacion = (ubicacion) => ({ latitud: ubicacion.latitud, longitud: ubicacion.longitud, fecha: ubicacion.fechaHora.slice(0, 10) })

export const publicarNovedad = (token, idAnimal, texto) => pedir(token, `/animales/${idAnimal}/novedades`, { metodo: 'POST', cuerpo: { texto } })

export const registrarUbicacion = (token, idAnimal, latitud, longitud) =>
  pedir(token, `/animales/${idAnimal}/ubicaciones`, { metodo: 'POST', cuerpo: { latitud, longitud } })
