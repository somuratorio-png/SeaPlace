import { useEffect, useRef, useState } from 'react'
import { rutaPorDefecto, rutas } from '../../data/rutas'
import { armarCamino } from '../../utils/camino'
import Icono from '../comunes/Icono'
import DatoRastreo from './DatoRastreo'
import MapaRastreo from './MapaRastreo'

const SEGUNDOS_POR_VUELTA = 45
const KM_POR_VUELTA = 38

// Mapa con la ubicación del animal (mock). El animal nada sin parar por su ruta:
// en cada cuadro de animación se avanza un poquito y se vuelve a dibujar.
const Rastreo = ({ animal }) => {
  const ruta = rutas[animal.id] ?? rutaPorDefecto
  const camino = armarCamino(ruta)

  const refCamino = useRef(null)
  const refAvance = useRef(0) // el avance "real"; el estado de abajo es la copia que se dibuja
  const [enMarcha, setEnMarcha] = useState(true)
  const [avance, setAvance] = useState(0) // de 0 (salida) a 1 (vuelta completa)
  const [posicion, setPosicion] = useState({ x: ruta[0][0], y: ruta[0][1] })

  useEffect(() => {
    if (!enMarcha) {
      return
    }

    let cuadro = null
    let anterior = null

    const animar = (ahora) => {
      const segundos = anterior === null ? 0 : (ahora - anterior) / 1000
      anterior = ahora

      const nuevo = (refAvance.current + segundos / SEGUNDOS_POR_VUELTA) % 1
      refAvance.current = nuevo

      // El navegador calcula qué punto del camino corresponde a ese avance
      const linea = refCamino.current
      const punto = linea.getPointAtLength(nuevo * linea.getTotalLength())
      setAvance(nuevo)
      setPosicion({ x: punto.x, y: punto.y })

      cuadro = requestAnimationFrame(animar)
    }

    cuadro = requestAnimationFrame(animar)

    // Al pausar o salir de la pantalla se corta la animación
    return () => cancelAnimationFrame(cuadro)
  }, [enMarcha])

  // Datos inventados a partir del avance, para que cambien de forma suave
  const velocidad = enMarcha ? 4.2 + 1.8 * Math.sin(avance * Math.PI * 6) : 0
  const profundidad = 12 + 9 * Math.sin(avance * Math.PI * 4 + 1)
  const distancia = avance * KM_POR_VUELTA
  const latitud = 30 + posicion.y / 10
  const longitud = 70 + (100 - posicion.x) / 10

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">Ubicación en vivo</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Seguí a {animal.nombre} mientras nada cerca de {animal.ubicacion}.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-space-md py-1 font-label-md text-label-md ${enMarcha ? 'bg-secondary-container text-on-secondary-fixed-variant' : 'bg-surface-container-high text-on-surface-variant'}`}>
            <span className={`w-2 h-2 rounded-full ${enMarcha ? 'bg-secondary animate-pulse' : 'bg-outline'}`} />
            {enMarcha ? 'En vivo' : 'En pausa'}
          </span>
          <button
            onClick={() => setEnMarcha(!enMarcha)}
            className="inline-flex items-center gap-1 bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-surface-tint"
          >
            <Icono nombre={enMarcha ? 'pause' : 'play_arrow'} clase="text-[18px]" />
            {enMarcha ? 'Pausar' : 'Reanudar'}
          </button>
        </div>
      </div>

      <MapaRastreo animal={animal} camino={camino} inicio={ruta[0]} avance={avance} posicion={posicion} refCamino={refCamino} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <DatoRastreo icono="speed" titulo="Velocidad" valor={`${velocidad.toFixed(1)} km/h`} />
        <DatoRastreo icono="scuba_diving" titulo="Profundidad" valor={`${profundidad.toFixed(1)} m`} />
        <DatoRastreo icono="route" titulo="Recorrido" valor={`${distancia.toFixed(1)} km`} />
        <DatoRastreo icono="my_location" titulo="Coordenadas" valor={`${latitud.toFixed(2)}° S, ${longitud.toFixed(2)}° O`} />
      </div>
    </div>
  )
}

export default Rastreo
