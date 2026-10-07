import Precio from '../comunes/Precio'

// El plan con el que el usuario apadrinó al animal
const MiPlan = ({ plan }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Tu apadrinamiento</h2>
      <div className="flex justify-between">
        <span className="font-title-lg text-title-lg text-on-surface">{plan.nombre}</span>
        <span className="font-headline-sm text-headline-sm text-primary"><Precio valor={plan.precio} />/mes</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.texto}</p>
    </div>
  )
}

export default MiPlan
