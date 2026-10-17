import Icono from '../comunes/Icono'

// Una pregunta del acordeón. "abierta" es true si se está mostrando su respuesta; onTocar la abre o la cierra.
const PreguntaFrecuente = ({ pregunta, respuesta, abierta, onTocar }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm">
      <button onClick={onTocar} className="w-full flex justify-between items-center p-space-md text-left">
        <span className="font-title-lg text-title-lg text-primary">{pregunta}</span>
        <Icono nombre={abierta ? 'expand_less' : 'expand_more'} />
      </button>
      {abierta && <p className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant">{respuesta}</p>}
    </div>
  )
}

export default PreguntaFrecuente