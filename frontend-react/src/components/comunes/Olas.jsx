// Borde con forma de olas. Se pinta del color de texto que reciba en "clase" (por ejemplo "text-surface").
const Olas = ({ clase = 'text-surface' }) => {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" className={`block w-full h-10 lg:h-16 ${clase}`}>
      <path fill="currentColor" opacity="0.45" d="M0 40 C 240 90 480 0 720 40 C 960 80 1200 10 1440 40 L1440 90 L0 90 Z" />
      <path fill="currentColor" d="M0 60 C 200 20 420 90 720 60 C 1020 30 1240 90 1440 55 L1440 90 L0 90 Z" />
    </svg>
  )
}

export default Olas
