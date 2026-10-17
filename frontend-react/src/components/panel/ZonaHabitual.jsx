// La zona habitual del animal (círculo punteado), con el refugio en el centro. Va dentro de un <svg>.
const ZonaHabitual = ({ zona }) => {
  return (
    <>
      <circle cx={zona.x} cy={zona.y} r={zona.radio} fill="#ffffff" fillOpacity="0.04" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.25" strokeDasharray="1.5 1.5" />
      <rect x={zona.x - 1.1} y={zona.y - 1.1} width="2.2" height="2.2" rx="0.4" fill="#c2512b" stroke="#ffffff" strokeWidth="0.35" />
      <text x={zona.x} y={zona.y + 3.6} textAnchor="middle" fontSize="1.9" fill="#ffffff" fillOpacity="0.8">
        Refugio
      </text>
    </>
  )
}

export default ZonaHabitual