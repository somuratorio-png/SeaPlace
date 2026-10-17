import Precio from '../comunes/Precio'
import { PRECIO_BOTIQUIN } from '../../utils/precios'

// El resumen de lo que se va a pagar: cada animal con su plan, el botiquín si se eligió y el total mensual
const ResumenPedido = ({ muelle, conBotiquin, total }) => {
  return (
    <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-sm">
      <h2 className="font-headline-sm text-headline-sm text-primary">Tu pedido</h2>
      {muelle.map((item) => (
        <div key={item.animal.id} className="flex justify-between gap-space-md font-body-md text-body-md">
          <span>
            {item.animal.nombre} · {item.plan.nombre} × {item.cantidad} {item.cantidad === 1 ? 'cupo' : 'cupos'}
          </span>
          <span className="text-primary">
            <Precio valor={item.plan.precio * item.cantidad} />
          </span>
        </div>
      ))}
      {conBotiquin && (
        <div className="flex justify-between gap-space-md font-body-md text-body-md">
          <span>Botiquín de rescate</span>
          <span className="text-primary">
            <Precio valor={PRECIO_BOTIQUIN} />
          </span>
        </div>
      )}
      <div className="flex justify-between items-baseline pt-space-sm border-t border-outline-variant">
        <span className="font-title-lg text-title-lg">Total mensual</span>
        <span className="font-headline-md text-headline-md text-primary">
          <Precio valor={total} />
        </span>
      </div>
    </div>
  )
}

export default ResumenPedido