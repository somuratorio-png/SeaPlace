// Interruptor del registro: "Quiero apadrinar" o "Soy un refugio".
// esRefugio es true cuando está elegido el refugio; onCambiar recibe el valor nuevo (true o false).
const SelectorTipoCuenta = ({ esRefugio, onCambiar }) => {
  return (
    <div className="grid grid-cols-2 gap-space-xs bg-primary-fixed/70 rounded-full p-1" role="group" aria-label="Tipo de cuenta">
      <button type="button" onClick={() => onCambiar(false)} aria-pressed={!esRefugio} className={`py-space-sm rounded-full font-label-lg text-label-lg transition ${esRefugio ? 'text-on-surface-variant' : 'bg-primary text-on-primary shadow-sm'}`}>
        Quiero apadrinar
      </button>
      <button type="button" onClick={() => onCambiar(true)} aria-pressed={esRefugio} className={`py-space-sm rounded-full font-label-lg text-label-lg transition ${esRefugio ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}`}>
        Soy un refugio
      </button>
    </div>
  )
}

export default SelectorTipoCuenta