import Precio from '../comunes/Precio'

const OpcionPlan = ({ plan, elegido, onElegir }) => {
  return (
    <label
      htmlFor={`plan-${plan.codigo}`}
      className={`flex items-start gap-space-md p-space-md rounded-xl cursor-pointer ${
        elegido ? 'ring-2 ring-primary bg-surface-container-lowest' : 'bg-surface-container-low'
      }`}
    >
      <input type="radio" id={`plan-${plan.codigo}`} name="plan" checked={elegido} onChange={onElegir} className="mt-1 accent-primary" />
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-title-lg text-title-lg text-on-surface">{plan.nombre}</span>
          <span className="font-headline-sm text-headline-sm text-primary"><Precio valor={plan.precio} />/mes</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.texto}</p>
      </div>
    </label>
  )
}

export default OpcionPlan