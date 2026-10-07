// La misma ola repetida dos veces a lo ancho. Al desplazarla un "período" (1440) queda igual que
// al principio, y por eso puede moverse sin parar sin que se note el corte.
const ola = (alto) => `M0 ${alto} C 240 ${alto + 40} 480 ${alto - 40} 720 ${alto} C 960 ${alto + 40} 1200 ${alto - 40} 1440 ${alto} C 1680 ${alto + 40} 1920 ${alto - 40} 2160 ${alto} C 2400 ${alto + 40} 2640 ${alto - 40} 2880 ${alto} L2880 90 L0 90 Z`

// Borde con forma de olas en movimiento. Se pinta del color de texto que reciba en "clase" (por ejemplo "text-surface").
const Olas = ({ clase = 'text-surface' }) => {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className={`block w-full h-10 lg:h-16 overflow-hidden ${clase}`}>
      <path className="ola-lenta" fill="currentColor" opacity="0.45" d={ola(42)} />
      <path className="ola-rapida" fill="currentColor" d={ola(58)} />
    </svg>
  )
}

export default Olas
