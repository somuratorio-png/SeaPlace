import { useEffect, useState } from 'react'
import { rutaPorDefecto, rutas } from '../../data/rutas'

const SEGUNDOS_ENTRE_ACTUALIZACIONES = 3

// Mapa con la ubicación del animal. Cada pocos segundos avanza al siguiente punto de su ruta.
const Rastreo = ({ animal }) => {
  const ruta = rutas[animal.id] ?? rutaPorDefecto
  const [paso, setPaso] = useState(0)
  const [hora, setHora] = useState(() => new Date())

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPaso((anterior) => (anterior + 1) % ruta.length)
      setHora(new Date())
    }, SEGUNDOS_ENTRE_ACTUALIZACIONES * 1000)

    // Al salir de la pantalla se corta el intervalo
    return () => clearInterval(intervalo)
  }, [ruta])

  const [x, y] = ruta[paso]
  const aTexto = (puntos) => puntos.map((punto) => punto.join(',')).join(' ')
  const recorrido = ruta.filter((punto, indice) => indice <= paso)

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
      <div className="flex justify-between items-center">
        <h2 className="font-title-lg text-title-lg text-on-surface">Ubicación en vivo</h2>
        <span className="font-label-md text-label-md text-secondary">● En vivo</span>
      </div>

      <svg viewBox="0 0 100 60" className="w-full rounded-lg bg-secondary-container" role="img" aria-label={`Mapa con la ruta de ${animal.nombre}`}>
        {/* Circuito completo en punteado y, encima, lo que ya recorrió */}
        <polygon points={aTexto(ruta)} className="fill-none stroke-secondary/40" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
        <polyline points={aTexto(recorrido)} className="fill-none stroke-secondary" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

        <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 1s linear' }}>
          <circle r="4" className="fill-primary/30 animate-pulse" />
          <circle r="1.8" className="fill-primary" />
        </g>
      </svg>

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        {animal.nombre} está en {animal.ubicacion} · Última actualización: {hora.toLocaleTimeString()}
      </p>
    </div>
  )
}

export default Rastreo
