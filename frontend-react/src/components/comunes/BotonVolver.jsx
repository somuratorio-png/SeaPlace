import Icono from './Icono'

// Botón con flecha para volver a la pantalla anterior. onVolver decide a dónde va.
const BotonVolver = ({ texto, onVolver }) => {
  return (
    <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
      <Icono nombre="arrow_back" clase="text-[18px]" /> {texto}
    </button>
  )
}

export default BotonVolver