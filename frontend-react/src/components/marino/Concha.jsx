// Concha de mar en forma de abanico. "clase" define el tamaño y la posición.
const Concha = ({ clase = 'w-14' }) => {
  return (
    <svg viewBox="0 0 100 90" aria-hidden="true" className={`pointer-events-none ${clase}`}>
      <path d="M50 84 C 20 80 4 56 6 34 C 8 16 26 6 50 6 C 74 6 92 16 94 34 C 96 56 80 80 50 84 Z" fill="#fbe1cf" stroke="#d9a183" strokeWidth="2" />
      {/* Las estrías salen todas desde la base */}
      <g fill="none" stroke="#d9a183" strokeWidth="2" strokeLinecap="round">
        <path d="M50 82 L 50 8" />
        <path d="M50 82 C 40 56 32 30 30 11" />
        <path d="M50 82 C 60 56 68 30 70 11" />
        <path d="M50 82 C 32 62 16 44 10 26" />
        <path d="M50 82 C 68 62 84 44 90 26" />
      </g>
      <path d="M40 84 Q 50 90 60 84 L 56 78 L 44 78 Z" fill="#e9b99c" stroke="#d9a183" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export default Concha
