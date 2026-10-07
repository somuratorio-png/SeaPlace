// Interruptor para ver los precios en pesos argentinos o en dólares
const BotonMoneda = ({ moneda, onCambiar }) => {
  const estilo = (opcion) => (opcion === moneda ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary')

  return (
    <div className="flex items-center bg-primary-fixed/70 rounded-full p-1" role="group" aria-label="Moneda de los precios">
      <button onClick={() => onCambiar('ARS')} aria-pressed={moneda === 'ARS'} className={`px-space-sm py-1 rounded-full font-label-md text-label-md transition ${estilo('ARS')}`}>
        ARS $
      </button>
      <button onClick={() => onCambiar('USD')} aria-pressed={moneda === 'USD'} className={`px-space-sm py-1 rounded-full font-label-md text-label-md transition ${estilo('USD')}`}>
        USD
      </button>
    </div>
  )
}

export default BotonMoneda
