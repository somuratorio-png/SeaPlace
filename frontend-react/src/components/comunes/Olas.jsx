// Borde con forma de olas (quieto). Se pinta del color de texto que reciba en "clase" (por ejemplo "text-surface").
const Olas = ({ clase = 'text-surface' }) => {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className={`block w-full h-10 lg:h-16 ${clase}`}>
      <path fill="currentColor" opacity="0.45" d="M0 42 C 240 82 480 2 720 42 C 960 82 1200 2 1440 42 L1440 90 L0 90 Z" />
      <path fill="currentColor" d="M0 58 C 200 26 420 88 720 58 C 1020 28 1240 88 1440 56 L1440 90 L0 90 Z" />
    </svg>
  )
}

export default Olas
