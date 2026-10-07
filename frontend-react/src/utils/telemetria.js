import { rutaPorDefecto, rutas } from '../data/rutas'

// Simulador del rastreo satelital (mock). Imita cómo funciona un transmisor real:
// no se ve al animal moverse, sino que cada tanto llega una "señal" con su posición.
// Entre señal y señal el animal viaja, se alimenta (bucea) o descansa, y a veces la señal
// se pierde porque estaba bajo el agua.
//
// El mapa mide 100 x 60 y cada unidad equivale a 1 km. Cada señal representa 2 horas.

export const HORAS_ENTRE_SENALES = 2

// Cuánto se mueve cada tipo de animal: radio de su zona habitual y velocidad relativa
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

// Número "al azar" entre 0 y 1 que depende solo de la semilla: con la misma semilla da siempre
// lo mismo. Así el recorrido de cada animal es siempre igual y no cambia en cada dibujo.
const azar = (semilla) => {
  const a = (semilla + 0x6d2b79f5) | 0
  const b = Math.imul(a ^ (a >>> 15), a | 1)
  const c = b ^ (b + Math.imul(b ^ (b >>> 7), b | 61))
  return ((c ^ (c >>> 14)) >>> 0) / 4294967296
}

// Convierte el id del animal en un número, para usarlo de semilla
const semillaDe = (animal) => [...animal.id].reduce((suma, letra) => suma * 31 + letra.charCodeAt(0), 7) % 100000

// El centro de la zona habitual es el promedio de los puntos definidos en data/rutas.js
export const zonaDe = (animal) => {
  const puntos = rutas[animal.id] ?? rutaPorDefecto
  const habito = habitos[animal.categoria] ?? habitos.focas
  return {
    x: puntos.reduce((suma, punto) => suma + punto[0], 0) / puntos.length,
    y: puntos.reduce((suma, punto) => suma + punto[1], 0) / puntos.length,
    radio: habito.radio,
    velocidad: habito.velocidad,
  }
}

// Las dos esquinas del mapa donde hay costa (coinciden con el dibujo de MapaRastreo)
const esTierra = (x, y) => (x > 70 && y < (x - 70) * 0.55) || (x < 24 && y > 48 + x * 0.5)

const fueraDelMapa = (x, y) => x < 5 || x > 95 || y < 5 || y > 55

// Según lo que venía haciendo, decide qué hace ahora
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

// Kilómetros que avanza en 2 horas según lo que esté haciendo
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

// La primera señal: sale desde el centro de su zona
export const primeraSenal = (animal) => {
  const zona = zonaDe(animal)
  return { n: 0, x: zona.x, y: zona.y, rumbo: azar(semillaDe(animal)) * Math.PI * 2, conducta: 'descansando', profundidad: 0, perdida: false, km: 0, tramo: 0 }
}

// Calcula la señal siguiente a partir de la anterior
export const siguienteSenal = (anterior, animal) => {
  const zona = zonaDe(animal)
  const n = anterior.n + 1
  const semilla = semillaDe(animal) + n * 10
  const conducta = elegirConducta(anterior.conducta, azar(semilla))

  // Cuando viaja mantiene más o menos el rumbo; cuando se alimenta gira para cualquier lado
  const giro = (azar(semilla + 1) - 0.5) * (conducta === 'alimentandose' ? 4.5 : 1.1)
  const rumboLibre = anterior.rumbo + giro

  // Si se alejó mucho de su zona, encara de vuelta hacia el centro
  const lejos = Math.hypot(anterior.x - zona.x, anterior.y - zona.y) > zona.radio
  const rumboACasa = Math.atan2(zona.y - anterior.y, zona.x - anterior.x)
  const rumboElegido = lejos ? rumboACasa + giro * 0.3 : rumboLibre

  const paso = pasoDe(conducta, azar(semilla + 2), zona.velocidad)
  const destinoX = anterior.x + Math.cos(rumboElegido) * paso
  const destinoY = anterior.y + Math.sin(rumboElegido) * paso

  // Si el destino cae en tierra o fuera del mapa, pega la vuelta hacia su zona
  const bloqueado = esTierra(destinoX, destinoY) || fueraDelMapa(destinoX, destinoY)
  const rumbo = bloqueado ? rumboACasa : rumboElegido
  const x = anterior.x + Math.cos(rumbo) * paso
  const y = anterior.y + Math.sin(rumbo) * paso

  // Buceando profundo, a veces el transmisor no llega a salir a la superficie
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

// Arma el recorrido que el animal "ya hizo" antes de abrir la pantalla
export const historialInicial = (animal, cantidad) => {
  const pasos = Array.from({ length: cantidad })
  return pasos.reduce((senales) => [...senales, siguienteSenal(senales[senales.length - 1], animal)], [primeraSenal(animal)])
}

// Cada señal son 2 horas: la número 13 es "Día 2 · 02:00"
export const horaDe = (senal) => {
  const horas = senal.n * HORAS_ENTRE_SENALES
  const dia = Math.floor(horas / 24) + 1
  return `Día ${dia} · ${String(horas % 24).padStart(2, '0')}:00`
}

// Pasa la posición del mapa a coordenadas (1 km ≈ 0,009° de latitud)
export const coordenadasDe = (senal) => {
  const latitud = 32.8 + senal.y * 0.009
  const longitud = 72.4 - senal.x * 0.0107
  return `${latitud.toFixed(3)}° S, ${longitud.toFixed(3)}° O`
}
