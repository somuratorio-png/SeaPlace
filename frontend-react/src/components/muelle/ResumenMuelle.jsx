import { PRECIO_BOTIQUIN, totalMuelle } from '../../utils/precios'
import Precio from '../comunes/Precio'

// Suma los precios, permite agregar el botiquín opcional y pasar a zarpar (el pago)
const ResumenMuelle = ({ muelle, conBotiquin, onBotiquin, onZarpar }) => {
  // Los totales se calculan cada vez que se dibuja: no hace falta guardarlos en el estado
  const subtotal = totalMuelle(muelle, false)
  const total = totalMuelle(muelle, conBotiquin)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Resumen</h2>

      <div className="flex justify-between font-body-md text-body-md">
        <span>Apadrinamientos ({muelle.length})</span>
        <span>
          <Precio valor={subtotal} />
        </span>
      </div>

      <label className="flex items-center gap-space-sm font-body-md text-body-md cursor-pointer">
        <input type="checkbox" checked={conBotiquin} onChange={() => onBotiquin(!conBotiquin)} className="accent-secondary w-4 h-4" />
        Sumar botiquín de rescate (+
        <Precio valor={PRECIO_BOTIQUIN} />)
      </label>

      <div className="flex justify-between items-baseline pt-space-sm border-t border-outline-variant">
        <span className="font-title-lg text-title-lg">Total mensual</span>
        <span className="font-headline-lg text-headline-lg-mobile text-primary">
          <Precio valor={total} />
        </span>
      </div>

      <button onClick={onZarpar} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-space-md rounded-full shadow-md hover:bg-tertiary-container">
        Zarpar
      </button>
    </div>
  )
}

export default ResumenMuelle
