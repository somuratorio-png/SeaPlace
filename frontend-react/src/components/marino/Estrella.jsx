// Estrella de mar. "clase" define el tamaño y la posición (por ejemplo "w-16 absolute left-4 top-4").
const Estrella = ({ clase = 'w-16' }) => {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`pointer-events-none ${clase}`}>
      <path
        d="M50 6 C 54 26 58 36 62 40 C 72 42 84 42 95 40 C 84 50 74 56 70 60 C 72 70 76 84 80 94 C 68 86 58 78 50 74 C 42 78 32 86 20 94 C 24 84 28 70 30 60 C 26 56 16 50 5 40 C 16 42 28 42 38 40 C 42 36 46 26 50 6 Z"
        fill="#e8795a"
        stroke="#c2512b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Puntitos claros sobre los brazos */}
      <g fill="#ffd9c7">
        <circle cx="50" cy="28" r="2.5" />
        <circle cx="50" cy="48" r="3.5" />
        <circle cx="68" cy="46" r="2.5" />
        <circle cx="32" cy="46" r="2.5" />
        <circle cx="62" cy="68" r="2.5" />
        <circle cx="38" cy="68" r="2.5" />
      </g>
    </svg>
  )
}

export default Estrella
