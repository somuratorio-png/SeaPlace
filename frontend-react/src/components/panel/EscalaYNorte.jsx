const EscalaYNorte = () => {
  return (
    <>
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
    </>
  )
}

export default EscalaYNorte