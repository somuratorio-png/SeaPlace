import { conductas } from '../../utils/telemetria'

// Líneas de la grilla del mapa (meridianos y paralelos)
const verticales = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const horizontales = [10, 20, 30, 40, 50]

// Dibujo del mapa. No muestra al animal moviéndose: muestra las señales que fueron llegando
// (un punto por cada una), unidas por una línea, y el marcador en la última posición conocida.
// "senales" son solo las que llegaron bien, de la más vieja a la más nueva.
const MapaRastreo = ({ animal, senales, zona }) => {
  const ultima = senales[senales.length - 1]

  // Cuanto más vieja es una señal, más transparente se dibuja
  const opacidad = (indice) => 0.15 + 0.85 * (indice / (senales.length - 1))

  // Un tramo une cada señal con la anterior (por eso se saltea la primera)
  const tramos = senales.slice(1).map((senal, indice) => ({ desde: senales[indice], hasta: senal, indice: indice + 1 }))

  return (
    <svg viewBox="0 0 100 60" className="block w-full rounded-2xl shadow-inner" role="img" aria-label={`Mapa con las últimas señales de ${animal.nombre}`}>
      <defs>
        <radialGradient id="mar" cx="35%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#1f8f96" />
          <stop offset="55%" stopColor="#0d6480" />
          <stop offset="100%" stopColor="#052f41" />
        </radialGradient>
        <clipPath id="foto">
          <circle r="2.6" />
        </clipPath>
      </defs>

      <rect width="100" height="60" fill="url(#mar)" />

      {/* Grilla de coordenadas */}
      {verticales.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.15" />
      ))}
      {horizontales.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.15" />
      ))}

      {/* Costa de arena con su espuma, arriba a la derecha y abajo a la izquierda */}
      <path d="M70 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#bdf0e9" fillOpacity="0.3" transform="translate(-1.2 1.2)" />
      <path d="M70 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#f3ead8" />
      <path d="M0 48 C 5 49 8 54 13 55 C 17 56 20 60 24 60 L0 60 Z" fill="#bdf0e9" fillOpacity="0.3" transform="translate(1.2 -1.2)" />
      <path d="M0 48 C 5 49 8 54 13 55 C 17 56 20 60 24 60 L0 60 Z" fill="#f3ead8" />

      {/* Zona habitual del animal, con el refugio en el centro */}
      <circle cx={zona.x} cy={zona.y} r={zona.radio} fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.25" strokeDasharray="1.5 1.5" />
      <rect x={zona.x - 1.1} y={zona.y - 1.1} width="2.2" height="2.2" rx="0.4" fill="#c2512b" stroke="#ffffff" strokeWidth="0.35" />
      <text x={zona.x} y={zona.y + 3.6} textAnchor="middle" fontSize="1.9" fill="#ffffff" fillOpacity="0.8">
        Refugio
      </text>

      {/* Recorrido: una línea recta entre señal y señal. La más nueva se dibuja de punta a punta. */}
      {tramos.map((tramo) => (
        <path
          key={tramo.hasta.n}
          d={`M ${tramo.desde.x} ${tramo.desde.y} L ${tramo.hasta.x} ${tramo.hasta.y}`}
          pathLength="1"
          className={tramo.hasta.n === ultima.n ? 'trazar' : ''}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={opacidad(tramo.indice) * 0.7}
          strokeWidth="0.35"
          strokeLinecap="round"
        />
      ))}

      {/* Un punto por cada señal recibida, del color de lo que estaba haciendo */}
      {senales.map((senal, indice) => (
        <circle key={senal.n} cx={senal.x} cy={senal.y} r="0.75" fill={conductas[senal.conducta].color} fillOpacity={opacidad(indice)} stroke="#052f41" strokeWidth="0.15" />
      ))}

      {/* Pulso: dos ondas que se expanden una sola vez cuando llega la señal.
          La "key" cambia con cada señal, y por eso la animación vuelve a empezar. */}
      <g key={ultima.n}>
        <circle className="pulso-gps" cx={ultima.x} cy={ultima.y} r="9" fill="none" stroke="#ffffff" strokeWidth="0.4" />
        <circle className="pulso-gps pulso-gps-tarde" cx={ultima.x} cy={ultima.y} r="9" fill="none" stroke="#ffffff" strokeWidth="0.4" />
      </g>

      {/* Marcador: la foto del animal en la última posición conocida */}
      <g className="marcador-gps" style={{ transform: `translate(${ultima.x}px, ${ultima.y}px)` }}>
        <image href={animal.imagen} x="-2.6" y="-2.6" width="5.2" height="5.2" preserveAspectRatio="xMidYMid slice" clipPath="url(#foto)" />
        <circle r="2.6" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <text y="-3.8" textAnchor="middle" fontSize="2.2" fontWeight="700" fill="#ffffff" stroke="#052f41" strokeWidth="0.5" paintOrder="stroke">
          {animal.nombre}
        </text>
      </g>

      {/* Escala y norte */}
      <g transform="translate(6 55)" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="0.3">
        <path d="M0 -0.8 V0 H10 V-0.8" fill="none" />
        <text x="5" y="-1.4" textAnchor="middle" fontSize="1.9" fill="#ffffff" stroke="none">
          10 km
        </text>
      </g>
      <g transform="translate(8 8)" fill="#ffffff" fillOpacity="0.8">
        <circle r="3.4" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.25" />
        <path d="M0 -2.8 L0.9 0 L0 2.8 L-0.9 0 Z" />
        <text y="-4.2" textAnchor="middle" fontSize="2">
          N
        </text>
      </g>
    </svg>
  )
}

export default MapaRastreo
