// Conversores de los patrocinadores y sus campañas de duplicación.
// No le hablan al backend: los pedidos los hacen los slices de src/Redux con axios.

// Los tres niveles de patrocinio. El backend calcula el de cada patrocinador según cuánto se comprometió
// a duplicar (la suma de los topes de sus campañas, en dólares). Acá están los textos para mostrarlos.
export const niveles = [
  {
    codigo: 'OCEANO',
    nombre: 'Océano',
    desde: 1000,
    icono: 'water',
    clase: 'bg-primary text-on-primary',
    beneficios: ['Logo destacado en el inicio, primero y más grande', 'Sello en las fichas de los animales que acompañás', 'Reporte de impacto para tu informe de sustentabilidad', 'Tu beneficio en el panel de todos los padrinos'],
  },
  {
    codigo: 'ARRECIFE',
    nombre: 'Arrecife',
    desde: 300,
    icono: 'waves',
    clase: 'bg-secondary text-on-secondary',
    beneficios: ['Logo en "Nos acompañan"', 'Sello en las fichas de los animales que acompañás', 'Reporte de impacto', 'Tu beneficio en el panel de los padrinos'],
  },
  {
    codigo: 'CORAL',
    nombre: 'Coral',
    desde: 0,
    icono: 'spa',
    clase: 'bg-tertiary text-on-tertiary',
    beneficios: ['Nombre en "Nos acompañan"', 'Sello en las fichas de los animales que acompañás', 'Reporte de impacto'],
  },
]

export const nivelDe = (codigo) => niveles.find((nivel) => nivel.codigo === codigo) || niveles[niveles.length - 1]

// Un patrocinador (lo público): { id, nombre, descripcion, sitioWeb, icono, beneficio, nivel, comprometido, aportado, animales }
export const aPatrocinador = (dato) => ({
  id: dato.idPatrocinador,
  nombre: dato.nombreEmpresa,
  descripcion: dato.descripcion || '',
  sitioWeb: dato.sitioWeb || '',
  icono: dato.icono || 'storefront',
  beneficio: dato.beneficio || '',
  nivel: dato.nivel,
  comprometido: dato.comprometido,
  aportado: dato.aportado,
  animales: dato.animalesAcompaniados,
})

// Un beneficio para padrinos, con su cupón: { id, empresa, icono, sitioWeb, beneficio, cupon }
export const aBeneficio = (dato) => ({
  id: dato.idPatrocinador,
  empresa: dato.nombreEmpresa,
  icono: dato.icono || 'storefront',
  sitioWeb: dato.sitioWeb || '',
  beneficio: dato.beneficio,
  cupon: dato.cupon,
})

// Una campaña: { id, idAnimal, animal, tope, aportado, restante, desde, hasta, activa, vigente } (fechas 'AAAA-MM-DD')
// porcentaje = cuánto del tope ya se usó (0 a 100). estado = 'PENDIENTE' (espera al refugio) | 'ACEPTADA' | 'RECHAZADA'.
// pendiente = todavía espera la respuesta del refugio. empresa = quién la propone { nombre, icono, descripcion }.
export const aCampania = (dato) => ({
  estado: dato.estado,
  motivoRechazo: dato.motivoRechazo || '',
  pendiente: dato.activa && dato.estado === 'PENDIENTE',
  empresa: { nombre: dato.nombreEmpresa, icono: dato.iconoEmpresa || 'storefront', descripcion: dato.descripcionEmpresa || '' },
  id: dato.idCampania,
  idAnimal: dato.idAnimal,
  animal: dato.nombreAnimal,
  tope: dato.tope,
  aportado: dato.aportado,
  restante: dato.restante,
  desde: dato.fechaInicio,
  hasta: dato.fechaFin,
  activa: dato.activa,
  vigente: dato.vigente,
  porcentaje: dato.tope > 0 ? Math.round((dato.aportado * 100) / dato.tope) : 0,
})

// El panel del patrocinador: su perfil (con el cupón), sus campañas y el impacto que lograron
export const aMiPatrocinio = (dato) => ({
  perfil: { ...aPatrocinador(dato.patrocinador), cupon: dato.cupon || '' },
  campanias: (dato.campanias || []).map(aCampania),
  impacto: { plata: dato.plataMovilizada, padrinos: dato.padrinosAlcanzados, aportes: dato.aportesDuplicados },
})

// La campaña que hoy duplica los aportes para un animal (va dentro de cada animal), o null
export const aPatrocinio = (dato) => (dato ? { empresa: dato.nombreEmpresa, icono: dato.icono || 'storefront', tope: dato.tope, restante: dato.restante, hasta: dato.fechaFin } : null)

// Lo que van a duplicar los patrocinadores en un muelle: por cada ítem con campaña vigente, el aporte
// (igual al precio del ítem, o lo que le quede de tope a la campaña)
export const duplicacionDe = (muelle) =>
  muelle
    .filter((item) => item.animal.patrocinio !== null)
    .map((item) => ({ id: item.animal.id, animal: item.animal.nombre, empresa: item.animal.patrocinio.empresa, aporte: Math.min(item.plan.precio * item.cantidad, item.animal.patrocinio.restante) }))
