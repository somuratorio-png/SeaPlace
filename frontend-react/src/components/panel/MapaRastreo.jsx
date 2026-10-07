// Líneas de la grilla del mapa (meridianos y paralelos)
const verticales = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const horizontales = [10, 20, 30, 40, 50]

// Dibujo del mapa: mar con profundidad, costa, la ruta completa, lo ya recorrido y el animal.
// "camino" es el dibujo de la ruta, "avance" va de 0 a 1 y "posicion" es dónde está ahora.
const MapaRastreo = ({ animal, camino, inicio, avance, posicion, refCamino }) => {
  return (
    <svg viewBox="0 0 100 60" className="block w-full rounded-2xl shadow-inner" role="img" aria-label={`Mapa con la ruta de ${animal.nombre}`}>
      <defs>
        <radialGradient id="mar" cx="35%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#2aa9a0" />
          <stop offset="55%" stopColor="#0f7f9a" />
          <stop offset="100%" stopColor="#06384c" />
        </radialGradient>
        <linearGradient id="estela" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bdf0e9" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <clipPath id="foto">
          <circle r="3.2" />
        </clipPath>
      </defs>

      <rect width="100" height="60" fill="url(#mar)" />

      {/* Grilla de coordenadas */}
      {verticales.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.15" />
      ))}
      {horizontales.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.15" />
      ))}

      {/* Corrientes: líneas que se desplazan despacio */}
      <path d="M-10 14 Q 20 8 50 14 T 110 12" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.3" strokeDasharray="4 6">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="14s" repeatCount="indefinite" />
      </path>
      <path d="M-10 46 Q 25 52 55 45 T 110 48" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.3" strokeDasharray="4 6">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="18s" repeatCount="indefinite" />
      </path>

      {/* Costa de arena con su espuma, arriba a la derecha y abajo a la izquierda */}
      <path d="M72 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#bdf0e9" fillOpacity="0.35" transform="translate(-1.2 1.2)" />
      <path d="M72 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#f3ead8" />
      <path d="M0 50 C 5 49 8 54 13 55 C 17 56 19 60 22 60 L0 60 Z" fill="#bdf0e9" fillOpacity="0.35" transform="translate(1.2 -1.2)" />
      <path d="M0 50 C 5 49 8 54 13 55 C 17 56 19 60 22 60 L0 60 Z" fill="#f3ead8" />

      {/* Ruta completa en punteado y, encima, la estela de lo que ya nadó */}
      <path ref={refCamino} d={camino} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.4" strokeDasharray="1.2 1.4" />
      <path d={camino} pathLength="1" fill="none" stroke="url(#estela)" strokeWidth="1.1" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - avance} />

      {/* Punto de partida: el refugio */}
      <circle cx={inicio[0]} cy={inicio[1]} r="1.6" fill="#c2512b" stroke="#ffffff" strokeWidth="0.5" />
      <text x={inicio[0]} y={inicio[1] + 4.2} textAnchor="middle" fontSize="2.2" fill="#ffffff" fillOpacity="0.85">
        Refugio
      </text>

      {/* El animal: ondas de sonar que se expanden y su foto en un círculo */}
      <g transform={`translate(${posicion.x} ${posicion.y})`}>
        <circle r="3.2" fill="none" stroke="#ffffff" strokeWidth="0.4">
          <animate attributeName="r" from="3.2" to="9" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle r="3.2" fill="none" stroke="#ffffff" strokeWidth="0.4">
          <animate attributeName="r" from="3.2" to="9" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.7" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
        </circle>
        <image href={animal.imagen} x="-3.2" y="-3.2" width="6.4" height="6.4" preserveAspectRatio="xMidYMid slice" clipPath="url(#foto)" />
        <circle r="3.2" fill="none" stroke="#ffffff" strokeWidth="0.6" />
        <text y="-4.6" textAnchor="middle" fontSize="2.4" fontWeight="700" fill="#ffffff">
          {animal.nombre}
        </text>
      </g>

      {/* Rosa de los vientos */}
      <g transform="translate(8 9)" fill="#ffffff" fillOpacity="0.8">
        <circle r="4" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.25" />
        <path d="M0 -3.4 L1 0 L0 3.4 L-1 0 Z" />
        <text y="-4.8" textAnchor="middle" fontSize="2.2">
          N
        </text>
      </g>
    </svg>
  )
}

export default MapaRastreo
