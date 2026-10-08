import { useContext, useState } from 'react'
import { ContextoPlanes } from '../../contexto/Planes'
import { planesDe } from '../../utils/precios'
import Precio from '../comunes/Precio'

// Permite pasar a otro plan o cancelar el apadrinamiento.
// Cancelar pide una segunda confirmación para que no pase por un clic de más.
const GestionPlan = ({ item, onCambiarPlan, onCancelar }) => {
  const [confirmando, setConfirmando] = useState(false)
  const planes = planesDe(item.animal, useContext(ContextoPlanes))

  const elegir = (evento) => {
    const plan = planes.find((p) => p.codigo === evento.target.value)
    onCambiarPlan(item.id, plan)
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Gestionar apadrinamiento</h2>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Cambiar de plan</span>
        <select
          value={item.plan.codigo}
          onChange={elegir}
          className="w-full bg-surface-container-low rounded-lg px-space-md py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40"
        >
          {planes.map((plan) => (
            <option key={plan.codigo} value={plan.codigo}>
              {plan.nombre}
            </option>
          ))}
        </select>
      </label>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Tu próxima cuota: <Precio valor={item.plan.precio * item.cupos} />. El cambio rige desde el próximo pago.
      </p>

      {confirmando ? (
        <div className="bg-error-container text-on-error-container rounded-xl p-space-md space-y-space-sm">
          <p className="font-body-sm text-body-sm">¿Seguro? {item.animal.nombre} va a dejar de recibir tu aporte mensual.</p>
          <div className="flex flex-wrap gap-space-md">
            <button onClick={() => onCancelar(item.id)} className="bg-error text-on-error font-label-lg text-label-lg px-space-md py-space-sm rounded-full">
              Sí, cancelar
            </button>
            <button onClick={() => setConfirmando(false)} className="font-label-lg text-label-lg px-space-md py-space-sm rounded-full underline">
              No, seguir apadrinando
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setConfirmando(true)} className="font-label-lg text-label-lg text-error hover:underline">
          Cancelar apadrinamiento
        </button>
      )}
    </div>
  )
}

export default GestionPlan
