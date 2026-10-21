export const HORAS_ENTRE_SENALES = 2

const habitos = {
  focas: { radio: 16, velocidad: 1 },
  nutrias: { radio: 9, velocidad: 0.5 },
  cetaceos: { radio: 26, velocidad: 1.6 },
  tortugas: { radio: 30, velocidad: 0.8 },
}

export const conductas = {
  viajando: { nombre: 'Viajando', color: '#ffffff' },
  alimentandose: { nombre: 'Alimentándose', color: '#ffd166' },
  descansando: { nombre: 'Descansando', color: '#ff9e80' },
}

const azar = (semilla) => {
  const a = (semilla + 0x6d2b79f5) | 0
  const b = Math.imul(a ^ (a >>> 15), a | 1)
  const c = b ^ (b + Math.imul(b ^ (b >>> 7), b | 61))
  return ((c ^ (c >>> 14)) >>> 0) / 4294967296
}

const semillaDe = (animal) => [...`${animal.id}${animal.nombre}`].reduce((suma, letra) => suma * 31 + letra.charCodeAt(0), 7) % 100000

const habitoDe = (animal) => {
  const texto = `${animal.nombreCategoria} ${animal.especie}`.toLowerCase()
  if (texto.includes('nutria')) return habitos.nutrias
  if (texto.includes('tortuga')) return habitos.tortugas
  if (texto.includes('cet') || texto.includes('ballena') || texto.includes('delf')) return habitos.cetaceos
  return habitos.focas
}

const CENTRO_POR_DEFECTO = { x: 48, y: 30 }

const acotar = (valor, minimo, maximo) => Math.min(maximo, Math.max(minimo, valor))

const puntoDe = (posicion) => ({
  x: acotar((72.4 - Math.abs(posicion.longitud)) / 0.0107, 8, 92),
  y: acotar((Math.abs(posicion.latitud) - 32.8) / 0.009, 8, 52),
})

export const zonaDe = (animal, posicion) => {
  const centro = posicion ? puntoDe(posicion) : CENTRO_POR_DEFECTO
  const habito = habitoDe(animal)
  return { x: centro.x, y: centro.y, radio: habito.radio, velocidad: habito.velocidad }
}

const esTierra = (x, y) => (x > 70 && y < (x - 70) * 0.55) || (x < 24 && y > 48 + x * 0.5)

const fueraDelMapa = (x, y) => x < 5 || x > 95 || y < 5 || y > 55

const elegirConducta = (anterior, suerte) => {
  if (anterior === 'viajando') {
    if (suerte < 0.62) return 'viajando'
    return suerte < 0.9 ? 'alimentandose' : 'descansando'
  }
  if (anterior === 'alimentandose') {
    if (suerte < 0.5) return 'alimentandose'
    return suerte < 0.85 ? 'viajando' : 'descansando'
  }
  return suerte < 0.45 ? 'descansando' : 'viajando'
}

const pasoDe = (conducta, suerte, velocidad) => {
  if (conducta === 'viajando') return (4 + suerte * 4) * velocidad
  if (conducta === 'alimentandose') return 0.6 + suerte * 1.6
  return suerte * 0.3
}

const profundidadDe = (conducta, suerte) => {
  if (conducta === 'viajando') return 2 + suerte * 14
  if (conducta === 'alimentandose') return 20 + suerte * 65
  return suerte * 1.5
}

export const primeraSenal = (animal, zona) => {
  return { n: 0, x: zona.x, y: zona.y, rumbo: azar(semillaDe(animal)) * Math.PI * 2, conducta: 'descansando', profundidad: 0, perdida: false, km: 0, tramo: 0 }
}

export const siguienteSenal = (anterior, animal, zona) => {
  const n = anterior.n + 1
  const semilla = semillaDe(animal) + n * 10
  const conducta = elegirConducta(anterior.conducta, azar(semilla))

  const giro = (azar(semilla + 1) - 0.5) * (conducta === 'alimentandose' ? 4.5 : 1.1)
  const rumboLibre = anterior.rumbo + giro

  const lejos = Math.hypot(anterior.x - zona.x, anterior.y - zona.y) > zona.radio
  const rumboACasa = Math.atan2(zona.y - anterior.y, zona.x - anterior.x)
  const rumboElegido = lejos ? rumboACasa + giro * 0.3 : rumboLibre

  const paso = pasoDe(conducta, azar(semilla + 2), zona.velocidad)
  const destinoX = anterior.x + Math.cos(rumboElegido) * paso
  const destinoY = anterior.y + Math.sin(rumboElegido) * paso

  const bloqueado = esTierra(destinoX, destinoY) || fueraDelMapa(destinoX, destinoY)
  const rumbo = bloqueado ? rumboACasa : rumboElegido
  const x = anterior.x + Math.cos(rumbo) * paso
  const y = anterior.y + Math.sin(rumbo) * paso

  const perdida = conducta === 'alimentandose' && azar(semilla + 3) < 0.3

  return {
    n,
    x,
    y,
    rumbo,
    conducta,
    profundidad: profundidadDe(conducta, azar(semilla + 4)),
    perdida,
    km: anterior.km + paso,
    tramo: paso,
  }
}

export const historialInicial = (animal, zona, cantidad) => {
  const pasos = Array.from({ length: cantidad })
  return pasos.reduce((senales) => [...senales, siguienteSenal(senales[senales.length - 1], animal, zona)], [primeraSenal(animal, zona)])
}

export const horaDe = (senal) => {
  const horas = senal.n * HORAS_ENTRE_SENALES
  const dia = Math.floor(horas / 24) + 1
  return `Día ${dia} · ${String(horas % 24).padStart(2, '0')}:00`
}

export const coordenadasDe = (senal) => {
  const latitud = 32.8 + senal.y * 0.009
  const longitud = 72.4 - senal.x * 0.0107
  return `${latitud.toFixed(3)}° S, ${longitud.toFixed(3)}° O`
}

export const resumirSenales = (senales, zona) => {
  const ultima = senales[senales.length - 1]
  const recibidas = senales.filter((senal) => !senal.perdida)
  const ultimaRecibida = recibidas[recibidas.length - 1]

  return {
    ultima,
    recibidas,
    ultimaRecibida,
    velocidad: ultimaRecibida.tramo / HORAS_ENTRE_SENALES,
    kmUltimoDia: senales.slice(-12).reduce((suma, senal) => suma + senal.tramo, 0),
    kmAlRefugio: Math.hypot(ultimaRecibida.x - zona.x, ultimaRecibida.y - zona.y),
    bateria: Math.max(20, 92 - ultima.n * 0.08),
  }
}
