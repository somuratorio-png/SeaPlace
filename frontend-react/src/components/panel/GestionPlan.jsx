import { useState } from 'react'
import { planesDe } from '../../utils/precios'
import Modal from '../comunes/Modal'
import Precio from '../comunes/Precio'
import { usePlanes } from '../../hooks/usePlanes'

// Permite pasar a otro plan o cancelar el apadrinamiento.
// Cancelar pide una segunda confirmación (un modal) para que no pase por un clic de más.
const GestionPlan = ({ item, onCambiarPlan, onCancelar }) => {
  const planesBase = usePlanes()
  const planes = planesDe(item.animal, planesBase)
  const [isVisible, setIsVisible] = useState(false)

  const elegir = (evento) => {
    const plan = planes.find((p) => p.codigo === evento.target.value)
    onCambiarPlan(item.id, plan)
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Gestionar apadrinamiento</h2>

      <label htmlFor="cambiarPlan" className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Cambiar de plan</span>
        <select
          id="cambiarPlan"
          name="plan"
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

      <button onClick={() => setIsVisible(true)} className="font-label-lg text-label-lg text-error hover:underline">
        Cancelar apadrinamiento
      </button>

      {isVisible && (
        <Modal
          titulo="¿Cancelar el apadrinamiento?"
          mensaje={`${item.animal.nombre} va a dejar de recibir tu aporte mensual. Sus cupos vuelven a estar disponibles y el apadrinamiento queda en tu historial.`}
          textoConfirmar="Sí, cancelar"
          textoCancelar="No, seguir apadrinando"
          peligro={true}
          onConfirmar={() => {
            onCancelar(item.id)
            setIsVisible(false)
          }}
          onCancelar={() => setIsVisible(false)}
        />
      )}
    </div>
  )
}

export default GestionPlan
