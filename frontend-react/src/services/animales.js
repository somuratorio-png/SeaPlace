import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { hoy } from '../utils/fechas'
import { pedir, pedirLista, pedirPagina, URL_BASE } from './api'

// Una foto subida como archivo tiene una url de la API (empieza con /animales/): hay que pedirla
// a través del proxy. Las demás son urls completas o imágenes que sirve el propio front.
const urlDeFoto = (url) => (url.startsWith('/animales/') ? URL_BASE + url : url)

// Pasa un animal del backend (AnimalResponse) al formato que usan los componentes.
// urgencia: 'critico' | 'recuperacion' | 'listo'. estado: el texto del cartelito de la tarjeta.
// publicacion: 'ACTIVA' | 'PAUSADA'. progreso: porcentaje de cupos ya tomados.
// descuento: { id, porcentaje, hasta } si hoy está en oferta, o null.
export const aAnimal = (dato) => {
  const urgencia = (dato.urgencia ?? 'RECUPERACION').toLowerCase()
  // Si el animal no tiene fotos, se usa una genérica
  const fotos = dato.fotos.length > 0 ? dato.fotos.map(urlDeFoto) : [heroFoca]

  return {
    id: dato.idAnimal,
    nombre: dato.nombreAnimal,
    descripcion: dato.descripcion ?? '',
    precio: dato.cuotaApadrinamiento,
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
    progreso: dato.progreso,
    imagen: fotos[0],
    fotos,
    descuento: dato.descuento ? { id: dato.descuento.idDescuento, porcentaje: dato.descuento.porcentaje, hasta: dato.descuento.fechaFin } : null,
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

// [{ id, nombre, icono }]
export const traerCategorias = async () =>
  (await pedirLista('/categorias')).map((categoria) => ({ id: categoria.idCategoria, nombre: categoria.nombreCategoria, icono: iconoDe(categoria.nombreCategoria) }))

// Solo la puede crear un administrador
export const crearCategoria = (nombreCategoria, descripcion) => pedir('/categorias', { metodo: 'POST', cuerpo: { nombreCategoria, descripcion } })

// Las publicaciones activas son públicas. Las pausadas solo las puede pedir el refugio (ve las suyas)
// o un administrador (ve todas).
export const traerAnimales = async (estado = 'ACTIVA') => (await pedirPagina(`/animales?estado=${estado}`)).map(aAnimal)

// datos = lo que carga el formulario del refugio. El refugio no se manda: el backend usa el de la cuenta.
export const crearAnimal = async (datos) =>
  aAnimal(
    await pedir('/animales', {
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
        cuposTotales: Number(datos.cuposTotales),
      },
    }),
  )

// 'ACTIVA' vuelve a mostrarla en el catálogo; 'PAUSADA' la oculta sin eliminarla
export const cambiarPublicacion = (idAnimal, estado) => pedir(`/animales/${idAnimal}`, { metodo: 'PUT', cuerpo: { estado } })

export const quitarAnimal = (idAnimal) => pedir(`/animales/${idAnimal}`, { metodo: 'DELETE' })

// "foto" es el texto (data URL) que arma utils/imagenes.js: fetch lo convierte de nuevo en un archivo
export const subirFoto = async (idAnimal, foto) => {
  const archivo = await (await fetch(foto)).blob()
  return pedir(`/animales/${idAnimal}/fotos/archivo`, { metodo: 'POST', archivo })
}

// La oferta rige desde hoy hasta la fecha elegida
export const ponerOferta = (idAnimal, porcentaje, hasta) =>
  pedir(`/animales/${idAnimal}/descuentos`, { metodo: 'POST', cuerpo: { porcentaje, fechaInicio: hoy(), fechaFin: hasta } })

export const quitarOferta = (idAnimal, idDescuento) => pedir(`/animales/${idAnimal}/descuentos/${idDescuento}`, { metodo: 'DELETE' })

// ---------- Bitácora y ubicación ----------

// [{ id, fecha: 'AAAA-MM-DD', texto }], de la más nueva a la más vieja
export const traerNovedades = async (idAnimal) =>
  (await pedirLista(`/animales/${idAnimal}/novedades`)).map((novedad) => ({ id: novedad.idNovedad, fecha: novedad.fecha.slice(0, 10), texto: novedad.texto }))

export const publicarNovedad = (idAnimal, texto) => pedir(`/animales/${idAnimal}/novedades`, { metodo: 'POST', cuerpo: { texto } })

// La última posición que informó el refugio: { latitud, longitud, fecha: 'AAAA-MM-DD' }, o null si nunca informó una
export const traerUltimaUbicacion = async (idAnimal) => {
  try {
    const ubicacion = await pedir(`/animales/${idAnimal}/ubicaciones/ultima`)
    return { latitud: ubicacion.latitud, longitud: ubicacion.longitud, fecha: ubicacion.fechaHora.slice(0, 10) }
  } catch (error) {
    // 404 = el animal todavía no tiene ninguna ubicación cargada
    if (error.estado === 404) return null
    throw error
  }
}

export const registrarUbicacion = (idAnimal, latitud, longitud) =>
  pedir(`/animales/${idAnimal}/ubicaciones`, { metodo: 'POST', cuerpo: { latitud, longitud } })
