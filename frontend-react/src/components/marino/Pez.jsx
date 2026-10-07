// Pez visto de costado, mirando a la derecha. "color" es el del cuerpo.
const Pez = ({ clase = 'w-12', color = '#8fdcd2' }) => {
  return (
    <svg viewBox="0 0 100 50" aria-hidden="true" className={`pointer-events-none ${clase}`}>
      <path d="M22 25 L 4 8 L 8 25 L 4 42 Z" fill={color} fillOpacity="0.8" />
      <ellipse cx="55" cy="25" rx="36" ry="16" fill={color} />
      <path d="M48 10 Q 58 0 70 12 Z" fill={color} fillOpacity="0.8" />
      <circle cx="78" cy="21" r="3" fill="#081a24" />
      <path d="M60 14 Q 54 25 60 36" fill="none" stroke="#081a24" strokeOpacity="0.25" strokeWidth="2" />
    </svg>
  )
}

export default Pez
