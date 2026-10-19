import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { hoy } from '../utils/fechas'
import { pedir, pedirLista, pedirPagina, URL_BASE } from './api'

// Una foto subida como archivo tiene una url de la API (empieza con /animales/): hay que pedirla
// a través del proxy. Las demás son urls completas o imágenes que sirve el propio front.
const urlDeFoto = (url) => (url.startsWith('/animales/') ? URL_BASE + url : url)

// Pasa un animal del backend (AnimalResponse) al formato que usan los componentes.
// precio: la cuota del plan Guardián de la Bahía (la del catálogo). preciosPorPlan: { BRISA_MARINA: 10, ... }, sin descuentos.
// urgencia: 'critico' | 'recuperacion' | 'listo'. estado: el texto del cartelito de la tarjeta.
// publicacion: 'ACTIVA' | 'PAUSADA' | 'PENDIENTE' (espera que un administrador la apruebe). progreso: porcentaje de cupos ya tomados.
// descuento: { id, porcentaje, hasta } si hoy está en oferta, o null.
// sinFotos: true si el refugio todavía no le subió ninguna (se muestra una genérica).
const aDescuento = (dato) => ({ id: dato.idDescuento, porcentaje: dato.porcentaje, hasta: dato.fechaFin })

export const aAnimal = (dato) => {
  const urgencia = (dato.urgencia ?? 'RECUPERACION').toLowerCase()
  // Si el animal no tiene fotos, se usa una genérica
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
    // Los datos de la ficha son opcionales en el backend: si faltan se muestra algo razonable
    especie: dato.especie ?? dato.nombreCategoria,
    edad: dato.edad ?? 'Sin datos',
    ubicacion: dato.ubicacion ?? dato.nombreRefugio,
    urgencia,
    estado: dato.condicion ?? urgencias.find((u) => u.id === urgencia).estado,
    destacado: dato.destacado,
    // true si el refugio pidió cambios sobre la publicación ya aprobada y un administrador todavía no los revisó
    cambioPendiente: dato.tieneCambioPendiente ?? false,
    // Los datos de la ficha tal como los cargó el refugio (vacíos si no los tiene), para editarlos
    ficha: { especie: dato.especie ?? '', edad: dato.edad ?? '', ubicacion: dato.ubicacion ?? '' },
    progreso: dato.progreso,
    imagen: fotos[0],
    fotos,
    sinFotos: dato.fotos.length === 0,
    descuento: dato.descuento ? aDescuento(dato.descuento) : null,
  }
}

// Ícono de cada categoría (el backend guarda solo el nombre): se elige por alguna palabra del nombre
const iconoDe = (nombre) => {
  const texto = nombre.toLowerCase()
  if (texto.includes('nutria')) return 'waves'
  if (texto.includes('cet') || texto.includes('ballena') || texto.includes('delf')) return 'sailing'
  if (texto.includes('tortuga')) return 'shield'
  return 'pets'
}

const aCategoria = (dato) => ({ id: dato.idCategoria, nombre: dato.nombreCategoria, icono: iconoDe(dato.nombreCategoria) })

// [{ id, nombre, icono }]
export const traerCategorias = () => pedirLista('/categorias').then((categorias) => categorias.map(aCategoria))

// Solo la puede crear un administrador. Devuelve la categoría creada.
export const crearCategoria = (nombreCategoria, descripcion) =>
  pedir('/categorias', { metodo: 'POST', cuerpo: { nombreCategoria, descripcion } }).then(aCategoria)

// El catálogo: las publicaciones activas, que son públicas
export const traerAnimales = (filtro = '') => pedirPagina(`/animales${filtro}`).then((animales) => animales.map(aAnimal))

export const filtroDePrecio = (precioMin, precioMax) => {
  const parametros = [precioMin === '' ? '' : `precioMin=${precioMin}`, precioMax === '' ? '' : `precioMax=${precioMax}`].filter((parametro) => parametro !== '')
  return parametros.length > 0 ? `?${parametros.join('&')}` : ''
}

// Un animal por su id. Si no existe (o su publicación no está activa y no es de quien lo pide) el backend responde 404.
export const traerAnimal = (idAnimal) => pedir(`/animales/${idAnimal}`).then(aAnimal)

// Las publicaciones activas, las pausadas y las pendientes de aprobación, para los paneles de gestión.
// En el backend es un listado por estado (las no activas solo las ve su refugio o un administrador),
// así que es un pedido por cada uno.
// Con idRefugio trae solo las de ese refugio; sin idRefugio, las de todos (para el administrador).
export const traerPublicaciones = (idRefugio) => {
  const filtro = idRefugio ? `&idRefugio=${idRefugio}` : ''
  return pedirPagina(`/animales?estado=ACTIVA${filtro}`).then((activas) =>
    pedirPagina(`/animales?estado=PAUSADA${filtro}`).then((pausadas) =>
      pedirPagina(`/animales?estado=PENDIENTE${filtro}`).then((pendientes) => [...activas, ...pausadas, ...pendientes].map(aAnimal)),
    ),
  )
}

// Las publicaciones de todos los refugios que esperan la aprobación del administrador
export const traerPendientes = () => pedirPagina('/animales?estado=PENDIENTE').then((pendientes) => pendientes.map(aAnimal))

// La aprueba un administrador: pasa a ACTIVA y aparece en el catálogo. Devuelve el animal ya aprobado.
export const aprobarAnimal = (idAnimal) => pedir(`/animales/${idAnimal}/aprobar`, { metodo: 'PUT' }).then(aAnimal)

// La rechaza un administrador: queda eliminada y el refugio recibe una notificación con el motivo (si se escribió)
export const rechazarAnimal = (idAnimal, motivo) => pedir(`/animales/${idAnimal}/rechazar`, { metodo: 'PUT', cuerpo: { motivo } })

// datos = lo que carga el formulario del refugio. El refugio no se manda: el backend usa el de la cuenta.
export const crearAnimal = (datos) =>
  pedir('/animales', {
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

// Lo que cambia entre el animal publicado (AnimalResponse) y lo que pidió su refugio (cambio), campo por campo:
// [{ campo: 'Edad', antes: '2 años', despues: '3 años', esPrecio: false }]. Solo van los que de verdad cambian.
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

// Los cambios que pidieron los refugios sobre publicaciones ya aprobadas (solo los ve un administrador):
// [{ animal, cambios }], con "cambios" como los arma "diferencias"
export const traerCambiosPendientes = () =>
  pedirLista('/animales/cambios-pendientes').then((lista) =>
    lista.map((pendiente) => ({ animal: aAnimal(pendiente.animal), cambios: diferencias(pendiente.animal, pendiente.cambio, pendiente.nombreCategoriaPropuesta) })),
  )

// Un administrador aplica los cambios (o los descarta, con el motivo si escribió uno). Devuelven el animal como queda.
export const aprobarCambios = (idAnimal) => pedir(`/animales/${idAnimal}/cambios/aprobar`, { metodo: 'PUT' }).then(aAnimal)

export const rechazarCambios = (idAnimal, motivo) => pedir(`/animales/${idAnimal}/cambios/rechazar`, { metodo: 'PUT', cuerpo: { motivo } }).then(aAnimal)

// Corrige los datos de un animal. "datos" tiene los mismos campos que al crearlo. Si todavía espera la aprobación,
// se aplican enseguida; si ya está publicado, quedan como pedido de cambio hasta que los revise un administrador
// (el animal vuelve igual, con cambioPendiente: true).
export const editarAnimal = (idAnimal, datos) =>
  pedir(`/animales/${idAnimal}`, {
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

export const quitarAnimal = (idAnimal) => pedir(`/animales/${idAnimal}`, { metodo: 'DELETE' })

// Las cuatro que siguen modifican un animal y devuelven ese animal ya actualizado, armado con lo
// que contestó el backend: así quien las llama lo guarda en su estado sin volver a pedir la lista.

// 'ACTIVA' vuelve a mostrarla en el catálogo; 'PAUSADA' la oculta sin eliminarla
export const cambiarPublicacion = (idAnimal, estado) => pedir(`/animales/${idAnimal}`, { metodo: 'PUT', cuerpo: { estado } }).then(aAnimal)

// "archivo" es el archivo elegido en un <input type="file">, tal cual: se manda sin procesar.
// El backend agrega la foto al final de la galería.
export const subirFoto = (animal, archivo) =>
  pedir(`/animales/${animal.id}/fotos/archivo`, { metodo: 'POST', archivo }).then((foto) => {
    const url = urlDeFoto(foto.urlImagen)
    const fotos = animal.sinFotos ? [url] : [...animal.fotos, url]
    return { ...animal, fotos, imagen: fotos[0], sinFotos: false }
  })

// La oferta rige desde hoy hasta la fecha elegida
export const ponerOferta = (animal, porcentaje, hasta) =>
  pedir(`/animales/${animal.id}/descuentos`, { metodo: 'POST', cuerpo: { porcentaje, fechaInicio: hoy(), fechaFin: hasta } }).then((descuento) => ({
    ...animal,
    descuento: aDescuento(descuento),
  }))

export const quitarOferta = (animal) =>
  pedir(`/animales/${animal.id}/descuentos/${animal.descuento.id}`, { metodo: 'DELETE' }).then(() => ({ ...animal, descuento: null }))

// ---------- Bitácora y ubicación ----------

// La bitácora y la última ubicación de un animal llegan dentro de cada apadrinamiento (ver apadrinar.js),
// así la pantalla del apadrinado las tiene con un solo pedido

// Una novedad de la bitácora: { id, fecha: 'AAAA-MM-DD', texto }
export const aNovedad = (novedad) => ({ id: novedad.idNovedad, fecha: novedad.fecha.slice(0, 10), texto: novedad.texto })

// La última posición que informó el refugio: { latitud, longitud, fecha: 'AAAA-MM-DD' }
export const aUbicacion = (ubicacion) => ({ latitud: ubicacion.latitud, longitud: ubicacion.longitud, fecha: ubicacion.fechaHora.slice(0, 10) })

export const publicarNovedad = (idAnimal, texto) => pedir(`/animales/${idAnimal}/novedades`, { metodo: 'POST', cuerpo: { texto } })

export const registrarUbicacion = (idAnimal, latitud, longitud) =>
  pedir(`/animales/${idAnimal}/ubicaciones`, { metodo: 'POST', cuerpo: { latitud, longitud } })
