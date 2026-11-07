import { PRECIO_BOTIQUIN, totalMuelle } from '../../utils/precios'
import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'
import { duplicacionDe } from '../../services/patrocinadores'

// Suma los precios, permite agregar el botiquín opcional y pasar a zarpar (el pago)
const ResumenMuelle = ({ muelle, conBotiquin, onBotiquin, onZarpar }) => {
  // Los totales se calculan cada vez que se dibuja: no hace falta guardarlos en el estado
  const subtotal = totalMuelle(muelle, false)
  const total = totalMuelle(muelle, conBotiquin)
  // Lo que van a poner los patrocinadores con campañas vigentes (no se le cobra al padrino)
  const duplicacion = duplicacionDe(muelle)
  const extra = duplicacion.reduce((suma, linea) => suma + linea.aporte, 0)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Resumen</h2>

      <div className="flex justify-between font-body-md text-body-md">
        <span>Apadrinamientos ({muelle.length})</span>
        <span>
          <Precio valor={subtotal} />
        </span>
      </div>

      <label htmlFor="conBotiquin" className="flex items-center gap-space-sm font-body-md text-body-md cursor-pointer">
        <input type="checkbox" id="conBotiquin" name="conBotiquin" checked={conBotiquin} onChange={() => onBotiquin(!conBotiquin)} className="accent-secondary w-4 h-4" />
        Sumar botiquín de rescate (+
        <Precio valor={PRECIO_BOTIQUIN} />)
      </label>

      <div className="flex justify-between items-baseline pt-space-sm border-t border-outline-variant">
        <span className="font-title-lg text-title-lg">Total mensual</span>
        <span className="font-headline-lg text-headline-lg-mobile text-primary">
          <Precio valor={total} />
        </span>
      </div>

      {/* Lo que suman los patrocinadores no se cobra: se muestra para que se vea cuánto rinde el aporte */}
      {duplicacion.length > 0 && (
        <div className="bg-tertiary-fixed text-on-tertiary-fixed rounded-xl p-space-md space-y-1">
          <p className="inline-flex items-center gap-1 font-label-lg text-label-lg">
            <Icono nombre="volunteer_activism" clase="text-[20px]" /> Tu aporte se duplica
          </p>
          {duplicacion.map((linea) => (
            <div key={linea.id} className="flex justify-between font-body-sm text-body-sm">
              <span>{linea.empresa} suma para {linea.animal}</span>
              <span>
                +<Precio valor={linea.aporte} />
              </span>
            </div>
          ))}
          <div className="flex justify-between font-label-lg text-label-lg pt-1">
            <span>Llega a los refugios</span>
            <span>
              <Precio valor={subtotal + extra} />
            </span>
          </div>
        </div>
      )}

      <button onClick={onZarpar} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-space-md rounded-full shadow-md hover:bg-tertiary-container">
        Zarpar
      </button>
    </div>
  )
}

export default ResumenMuelle
