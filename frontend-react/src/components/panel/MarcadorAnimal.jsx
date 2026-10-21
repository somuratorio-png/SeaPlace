const MarcadorAnimal = ({ animal, ultima }) => {
  return (
    <>
      <defs>
        <clipPath id="foto">
          <circle r="2.6" />
        </clipPath>
      </defs>

      <g key={ultima.n}>
        <circle className="pulso-gps" cx={ultima.x} cy={ultima.y} r="9" fill="none" stroke="#ffffff" strokeWidth="0.4" />
        <circle className="pulso-gps pulso-gps-tarde" cx={ultima.x} cy={ultima.y} r="9" fill="none" stroke="#ffffff" strokeWidth="0.4" />
      </g>

      <g className="marcador-gps" style={{ transform: `translate(${ultima.x}px, ${ultima.y}px)` }}>
        <image href={animal.imagen} x="-2.6" y="-2.6" width="5.2" height="5.2" preserveAspectRatio="xMidYMid slice" clipPath="url(#foto)" />
        <circle r="2.6" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        <text y="-3.8" textAnchor="middle" fontSize="2.2" fontWeight="700" fill="#ffffff" stroke="#052f41" strokeWidth="0.5" paintOrder="stroke">
          {animal.nombre}
        </text>
      </g>
    </>
  )
}

export default MarcadorAnimal