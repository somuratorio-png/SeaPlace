import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { URL_BASE } from '../Redux/api'
import { aComentario } from './comentarios'

// Conversores: pasan lo que manda el backend al formato que usan los componentes (y al revés).
// No le hablan al backend: los pedidos los hacen los slices de src/Redux con axios.

// Una foto subida como archivo tiene una url de la API (empieza con /animales/): hay que pedirla
// a través del proxy. Las demás son urls completas o imágenes que sirve el propio front.
export const urlDeFoto = (url) => (url.startsWith('/animales/') ? `${URL_BASE}${url}` : url)

// Pasa un animal del backend (AnimalResponse) al formato que usan los componentes.
// precio: la cuota del plan Guardián de la Bahía (la del catálogo). preciosPorPlan: { GUARDIAN_DE_LA_BAHIA: 20, MAREA_PROFUNDA: 40 }, sin descuentos.
// urgencia: 'critico' | 'recuperacion' | 'listo'. estado: el texto del cartelito de la tarjeta.
// publicacion: 'ACTIVA' | 'PAUSADA' | 'PENDIENTE' (espera que un administrador la apruebe). progreso: porcentaje de cupos ya tomados.
// descuento: { id, porcentaje, hasta } si hoy está en oferta, o null.
// sinFotos: true si el refugio todavía no le subió ninguna (se muestra una genérica).
export const aDescuento = (dato) => ({ id: dato.idDescuento, porcentaje: dato.porcentaje, hasta: dato.fechaFin })

export const aAnimal = (dato) => {
  const urgencia = (dato.urgencia || 'RECUPERACION').toLowerCase()
  // Si el animal no tiene fotos, se usa una genérica
  const fotos = dato.fotos.length > 0 ? dato.fotos.map(urlDeFoto) : [heroFoca]

  return {
    id: dato.idAnimal,
    nombre: dato.nombreAnimal,
    descripcion: dato.descripcion || '',
    precio: dato.cuotaApadrinamiento,
    preciosPorPlan: dato.preciosPorPlan || {},
    cuposTotales: dato.cuposTotales,
    cuposDisponibles: dato.cuposDisponibles,
    publicacion: dato.estado,
    categoria: dato.idCategoria,
    nombreCategoria: dato.nombreCategoria,
    idRefugio: dato.idRefugio,
    // Los datos de la ficha son opcionales en el backend: si faltan se muestra algo razonable
    especie: dato.especie || dato.nombreCategoria,
    edad: dato.edad || 'Sin datos',
    ubicacion: dato.ubicacion || dato.nombreRefugio,
    urgencia,
    estado: dato.condicion || urgencias.find((u) => u.id === urgencia).estado,
    destacado: dato.destacado,
    // true si el refugio pidió cambios sobre la publicación ya aprobada y un administrador todavía no los revisó
    cambioPendiente: dato.tieneCambioPendiente || false,
    // Los datos de la ficha tal como los cargó el refugio (vacíos si no los tiene), para editarlos
    ficha: { especie: dato.especie || '', edad: dato.edad || '', ubicacion: dato.ubicacion || '' },
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

// { id, nombre, icono }
export const aCategoria = (dato) => ({ id: dato.idCategoria, nombre: dato.nombreCategoria, icono: iconoDe(dato.nombreCategoria) })

// Pasa lo que carga el formulario del refugio al cuerpo que espera el backend (para crear y para editar).
// El refugio no se manda: el backend usa el de la cuenta.
export const aCuerpoAnimal = (datos) => ({
  idCategoria: Number(datos.categoria),
  nombreAnimal: datos.nombre,
  especie: datos.especie,
  edad: datos.edad,
  ubicacion: datos.ubicacion,
  urgencia: datos.urgencia.toUpperCase(),
  condicion: urgencias.find((u) => u.id === datos.urgencia).estado,
  descripcion: datos.descripcion,
  cuotaApadrinamiento: Number(datos.precio),
  precioMareaProfunda: Number(datos.precioMarea),
  cuposTotales: Number(datos.cuposTotales),
})

// Lo que cambia entre el animal publicado (AnimalResponse) y lo que pidió su refugio (cambio), campo por campo:
// [{ campo: 'Edad', antes: '2 años', despues: '3 años', esPrecio: false }]. Solo van los que de verdad cambian.
export const diferencias = (actual, cambio, nombreCategoriaPropuesta) => {
  const campos = [
    { campo: 'Categoría', antes: actual.nombreCategoria, despues: cambio.idCategoria === actual.idCategoria ? null : nombreCategoriaPropuesta },
    { campo: 'Nombre', antes: actual.nombreAnimal, despues: cambio.nombreAnimal },
    { campo: 'Especie', antes: actual.especie, despues: cambio.especie },
    { campo: 'Salud', antes: actual.condicion, despues: cambio.condicion },
    { campo: 'Edad', antes: actual.edad, despues: cambio.edad },
    { campo: 'Ubicación', antes: actual.ubicacion, despues: cambio.ubicacion },
    { campo: 'Cupos', antes: actual.cuposTotales, despues: cambio.cuposTotales },
    { campo: 'Guardián de la Bahía', antes: actual.cuotaApadrinamiento, despues: cambio.cuotaApadrinamiento, esPrecio: true },
    { campo: 'Marea Profunda', antes: actual.preciosPorPlan && actual.preciosPorPlan.MAREA_PROFUNDA, despues: cambio.precioMareaProfunda, esPrecio: true },
    { campo: 'Historia', antes: actual.descripcion, despues: cambio.descripcion },
  ]
  return campos
    .filter((c) => c.despues !== null && c.despues !== undefined && c.despues !== c.antes)
    .map((c) => ({ ...c, antes: c.antes === null || c.antes === undefined ? '—' : c.antes, esPrecio: c.esPrecio || false }))
}

// La bitácora y la última ubicación de un animal llegan dentro de cada apadrinamiento (ver apadrinar.js)

// Una novedad de la bitácora: { id, fecha: 'AAAA-MM-DD', texto, comentarios }.
// comentarios = la conversación de sus padrinos y su refugio, de la más vieja a la más nueva (ver aComentario).
export const aNovedad = (novedad) => ({
  id: novedad.idNovedad,
  fecha: novedad.fecha.slice(0, 10),
  texto: novedad.texto,
  comentarios: (novedad.comentarios || []).map(aComentario),
})

// La última posición que informó el refugio: { latitud, longitud, fecha: 'AAAA-MM-DD' }
export const aUbicacion = (ubicacion) => ({ latitud: ubicacion.latitud, longitud: ubicacion.longitud, fecha: ubicacion.fechaHora.slice(0, 10) })
