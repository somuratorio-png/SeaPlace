import * as img from './imagenes'

// Datos de ejemplo (los que antes estaban escritos a mano dentro de cada <article>).
// Es la "base de datos" mock del front: el catálogo, el inicio y el detalle salen de acá
// (a través de services/animalesService.js).

export const CATEGORIAS = {
  focas: { label: 'Focas y Leones Marinos', icon: 'pets' },
  nutrias: { label: 'Nutrias del Pacífico', icon: 'waves' },
  cetaceos: { label: 'Cetáceos y Ballenas', icon: 'sailing' },
  tortugas: { label: 'Tortugas Marinas', icon: 'shield' },
  aves: { label: 'Aves Costeras', icon: 'flight' },
}

// Estilos del puntito + texto de estado en la tarjeta del catálogo
const ESTADO = {
  critico: { dot: 'bg-error', text: 'text-error', pulse: true },
  secundario: { dot: 'bg-secondary', text: 'text-secondary', pulse: false },
  secundarioPulso: { dot: 'bg-secondary', text: 'text-secondary', pulse: true },
  terciario: { dot: 'bg-tertiary', text: 'text-tertiary', pulse: false },
}

export const animalesEjemplo = [
  {
    id: 'nori',
    nombre: 'Nori',
    especie: 'Foca Común',
    categoria: 'focas',
    urgencia: 'recovering',
    edadMeses: 4,
    ingreso: '2026-05-20',
    estado: { label: 'En Recuperación', ...ESTADO.secundarioPulso },
    ubicacion: { label: 'Ensenada Salina', icon: 'healing', destacada: false },
    descripcion:
      'Rescatada tras una tormenta en la Ensenada Salina. Requiere alimentación con papilla rica en salmón y vitaminas.',
    fondo: { label: 'Nutrición y rehabilitación', progreso: 68 },
    precio: 24,
    imagen: img.nori,
    alt: 'Nori, cría de foca común de 4 meses, descansando junto a la orilla',
    destacado: {
      badge: { label: 'En Recuperación', icon: 'healing', clase: 'bg-secondary text-on-secondary' },
      edad: '4 meses de edad',
    },
    // Solo Nori tiene ficha completa (era la única página de detalle del diseño original)
    detalle: {
      nombreCientifico: 'Phoca vitulina',
      lema: 'Pequeña exploradora de corrientes frías',
      origen: 'Rescatada en Playas del Pacífico Norte',
      galeria: [
        { src: img.noriPrincipal, alt: 'Nori descansando en una poza costera de agua salada' },
        { src: img.noriAsomandose, alt: 'Nori asomándose detrás de una roca húmeda' },
        { src: img.noriAlimentacion, alt: 'Bióloga alimentando a Nori con mamadera en la clínica' },
        { src: img.noriBuceando, alt: 'Nori nadando bajo el agua en el recinto de quelpos' },
        { src: img.noriHocico, alt: 'Primer plano del hocico y los bigotes de Nori' },
      ],
    },
  },
  {
    id: 'kelp',
    nombre: 'Kelp',
    especie: 'Nutria de Mar',
    categoria: 'nutrias',
    urgencia: 'ready',
    edadMeses: 12,
    ingreso: '2026-02-11',
    estado: { label: 'Monitoreo GPS', ...ESTADO.terciario },
    ubicacion: { label: 'Bosque de Quelpos', icon: 'satellite_alt', destacada: true },
    descripcion:
      'Huérfana adoptiva criada en el bosque de quelpos. Excelente buceadora que monitorea los arrecifes rocosos.',
    fondo: { label: 'Monitoreo satelital', progreso: 84 },
    precio: 20,
    imagen: img.kelp,
    alt: 'Kelp, nutria marina flotando de espaldas envuelta en algas',
    destacado: {
      badge: { label: 'Monitoreo GPS', icon: 'satellite_alt', clase: 'bg-tertiary text-on-tertiary' },
      edad: '1 año de edad',
    },
  },
  {
    id: 'coral',
    nombre: 'Coral',
    especie: 'León Marino',
    categoria: 'focas',
    urgencia: 'ready',
    edadMeses: 24,
    ingreso: '2025-11-02',
    estado: { label: 'Rehabilitado', ...ESTADO.secundario },
    ubicacion: { label: 'Costa de Granito', icon: 'check_circle', destacada: false },
    descripcion:
      'Tratado por enredo de redes de pesca fantasma. Ya ha recuperado toda su fuerza muscular y nada en aguas abiertas.',
    fondo: { label: 'Seguimiento post-liberación', progreso: 91 },
    precio: 18,
    imagen: img.coral,
    alt: 'Coral, león marino tomando sol sobre rocas costeras',
    destacado: {
      badge: {
        label: 'Rehabilitado',
        icon: 'check_circle',
        clase: 'bg-secondary-container text-on-secondary-container',
      },
      edad: '2 años de edad',
    },
  },
  {
    id: 'mar',
    nombre: 'Mar',
    especie: 'Tortuga Laúd',
    categoria: 'tortugas',
    urgencia: 'ready',
    edadMeses: 96,
    ingreso: '2026-01-15',
    estado: { label: 'Ruta Migratoria', ...ESTADO.terciario },
    ubicacion: { label: 'Pacífico Abierto', icon: 'navigation', destacada: true },
    descripcion:
      'Custodiada durante su cruce transoceánico de anidación. Su rastreador satelital previene colisiones con barcos.',
    fondo: { label: 'Rastreo satelital', progreso: 52 },
    precio: 25,
    imagen: img.mar,
    alt: 'Mar, tortuga laúd nadando en aguas turquesas',
    destacado: {
      badge: { label: 'Ruta Migratoria', icon: 'satellite_alt', clase: 'bg-tertiary text-on-tertiary' },
      edad: '8 años de edad',
    },
  },
  {
    id: 'luna',
    nombre: 'Luna',
    especie: 'Foca Monje',
    categoria: 'focas',
    urgencia: 'critical',
    edadMeses: 14,
    ingreso: '2026-09-02',
    estado: { label: 'Peligro Crítico', ...ESTADO.critico },
    ubicacion: { label: "Bahía Moloka'i", icon: 'satellite_alt', destacada: true },
    descripcion:
      'Rescatada con desnutrición severa y enredo en redes de deriva. Requiere antibioterapia salina y nutrición enteral continua.',
    fondo: { label: 'Fondo médico de rescate', progreso: 78 },
    precio: 18,
    imagen: img.luna,
    alt: 'Luna, foca monje descansando sobre la arena',
  },
  {
    id: 'barnaby',
    nombre: 'Barnaby',
    especie: 'Nutria Marina',
    categoria: 'nutrias',
    urgencia: 'recovering',
    edadMeses: 10,
    ingreso: '2026-07-19',
    estado: { label: 'En Rehabilitación', ...ESTADO.secundario },
    ubicacion: { label: 'Monterey Bay', icon: 'water', destacada: false },
    descripcion:
      'Recuperado de hipotermia tras contaminación de pelaje. Actualmente en estimulación de acicalado y dieta rica en erizos y almejas.',
    fondo: { label: 'Tratamiento de pelaje & dieta', progreso: 92 },
    precio: 22,
    imagen: img.barnaby,
    alt: 'Barnaby, nutria marina joven flotando entre algas',
  },
  {
    id: 'oceano',
    nombre: 'Océano',
    especie: 'Foca Moteada',
    categoria: 'focas',
    urgencia: 'recovering',
    edadMeses: 2,
    ingreso: '2026-08-28',
    estado: { label: 'Cría Huérfana', ...ESTADO.secundarioPulso },
    ubicacion: { label: 'Unidad Neonatal', icon: 'local_hospital', destacada: false },
    descripcion:
      'Separada de su madre tras fuertes marejadas invernales. Recibe papilla de arenque fortificada y electrolitos salinos marinos.',
    fondo: { label: 'Nutrición láctea especializada', progreso: 64 },
    precio: 15,
    imagen: img.oceano,
    alt: 'Océano, cría de foca moteada sobre piedras de la costa',
  },
  {
    id: 'kailani',
    nombre: 'Kailani',
    especie: 'Delfín Mular',
    categoria: 'cetaceos',
    urgencia: 'ready',
    edadMeses: 60,
    ingreso: '2026-03-08',
    estado: { label: 'Monitoreo Satelital', ...ESTADO.terciario },
    ubicacion: { label: 'Canal de Santa Bárbara', icon: 'navigation', destacada: true },
    descripcion:
      'Marcaje acústico no invasivo para registrar patrones de navegación y prevenir colisiones con embarcaciones comerciales.',
    fondo: { label: 'Vigilancia satelital de corredor', progreso: 85 },
    precio: 25,
    imagen: img.kailani,
    alt: 'Kailani, delfín mular saltando entre las olas',
  },
  {
    id: 'arenita',
    nombre: 'Arenita',
    especie: 'Tortuga Golfina',
    categoria: 'tortugas',
    urgencia: 'ready',
    edadMeses: 36,
    ingreso: '2026-04-30',
    estado: { label: 'Nido Protegido', ...ESTADO.secundario },
    ubicacion: { label: 'Costa Oaxaqueña', icon: 'egg', destacada: false },
    descripcion:
      'Patrullaje nocturno de desove y viveros de temperatura controlada para asegurar el nacimiento seguro de 98 crías marinas.',
    fondo: { label: 'Protección del vivero litoral', progreso: 100 },
    precio: 15,
    imagen: img.arenita,
    alt: 'Arenita, tortuga golfina nadando cerca de pastos marinos',
  },
  {
    id: 'sammy',
    nombre: 'Sammy',
    especie: 'León Marino',
    categoria: 'focas',
    urgencia: 'recovering',
    edadMeses: 30,
    ingreso: '2026-06-12',
    estado: { label: 'Aleta en Cicatrización', ...ESTADO.terciario },
    ubicacion: { label: 'San Francisco Bay', icon: 'healing', destacada: false },
    descripcion:
      'Curación de herida dorsal por anzuelo de palangre. Ya realiza nados cortos en piscinas salinas de rehabilitación física.',
    fondo: { label: 'Fisioterapia en agua marina', progreso: 52 },
    precio: 20,
    imagen: img.sammy,
    alt: 'Sammy, león marino sobre rocas costeras',
  },
]

export const destacados = animalesEjemplo.filter((a) => a.destacado)

export const buscarEjemplo = (id) => {
  return animalesEjemplo.find((a) => a.id === id) ?? null
}

// Arma la lista de "pills" de categoría a partir de los animales que hay,
// con la cantidad de cada una (antes esos números estaban escritos a mano).
export const categoriasDe = (animales) => {
  // Categorías sin repetir, en el orden en que aparecen; después se cuenta cada una con .filter()
  const keys = [...new Set(animales.map((a) => a.categoria))]
  return keys.map((key) => ({
    key,
    label: CATEGORIAS[key]?.label ?? key,
    icon: CATEGORIAS[key]?.icon ?? 'pets',
    cantidad: animales.filter((a) => a.categoria === key).length,
  }))
}
