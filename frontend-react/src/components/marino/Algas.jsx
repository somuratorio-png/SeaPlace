// Mata de algas que se hamaca con la corriente. Se apoya en el borde de abajo de quien la contenga.
const Algas = ({ clase = 'w-20' }) => {
  return (
    <svg viewBox="0 0 100 140" aria-hidden="true" className={`pointer-events-none ${clase}`}>
      <g fill="none" strokeLinecap="round">
        <path className="ondular" d="M30 140 C 10 110 46 92 28 62 C 16 42 38 26 30 6" stroke="#0f7f79" strokeWidth="9" />
        <path className="ondular" style={{ animationDelay: '1.2s' }} d="M54 140 C 72 112 40 96 58 70 C 70 52 50 40 56 22" stroke="#2aa9a0" strokeWidth="8" />
        <path className="ondular" style={{ animationDelay: '2.4s' }} d="M76 140 C 62 120 88 104 76 84 C 68 70 82 60 78 46" stroke="#0b5f5a" strokeWidth="7" />
      </g>
    </svg>
  )
}

export default Algas
