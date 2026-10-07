// Sol poniéndose sobre el horizonte y tres gaviotas a lo lejos. Va de fondo en las portadas.
const Atardecer = () => {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" className="absolute right-0 bottom-0 h-full max-w-none pointer-events-none">
      <defs>
        <radialGradient id="sol" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3d6" />
          <stop offset="45%" stopColor="#ffd08a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd08a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* El resplandor grande y, adentro, el disco del sol */}
      <circle className="resplandor" cx="300" cy="262" r="150" fill="url(#sol)" />
      <circle cx="300" cy="262" r="46" fill="#fff3d6" fillOpacity="0.95" />

      {/* Reflejos del sol sobre el agua */}
      <g stroke="#fff3d6" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="2.5">
        <line x1="262" y1="232" x2="338" y2="232" />
        <line x1="274" y1="246" x2="326" y2="246" />
      </g>

      {/* Gaviotas: cada una son dos arquitos */}
      <g className="planear" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round">
        <path d="M150 90 q 9 -10 18 0 q 9 -10 18 0" />
        <path d="M205 62 q 6 -7 12 0 q 6 -7 12 0" />
        <path d="M118 130 q 5 -6 10 0 q 5 -6 10 0" />
      </g>
    </svg>
  )
}

export default Atardecer
