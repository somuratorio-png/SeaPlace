const verticales = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const horizontales = [10, 20, 30, 40, 50]

const FondoMapa = () => {
  return (
    <>
      <defs>
        <radialGradient id="mar" cx="35%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#1f8f96" />
          <stop offset="55%" stopColor="#0d6480" />
          <stop offset="100%" stopColor="#052f41" />
        </radialGradient>
      </defs>

      <rect width="100" height="60" fill="url(#mar)" />

      {verticales.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.15" />
      ))}
      {horizontales.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.15" />
      ))}

      <path d="M70 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#bdf0e9" fillOpacity="0.3" transform="translate(-1.2 1.2)" />
      <path d="M70 0 C 76 6 86 4 90 10 C 94 15 100 12 100 16 L100 0 Z" fill="#f3ead8" />
      <path d="M0 48 C 5 49 8 54 13 55 C 17 56 20 60 24 60 L0 60 Z" fill="#bdf0e9" fillOpacity="0.3" transform="translate(1.2 -1.2)" />
      <path d="M0 48 C 5 49 8 54 13 55 C 17 56 20 60 24 60 L0 60 Z" fill="#f3ead8" />
    </>
  )
}

export default FondoMapa