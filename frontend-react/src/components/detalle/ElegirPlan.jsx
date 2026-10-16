import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuelle } from '../../hooks/useMuelle'
import { usePlanes } from '../../hooks/usePlanes'
import { useSesion } from '../../hooks/useSesion'
import { planesDe } from '../../utils/precios'
import Precio from '../comunes/Precio'

// Muestra los 3 niveles de apadrinamiento (los que manda el backend). El precio de cada uno sale
// de la cuota del animal (con el descuento ya aplicado si está en oferta).
// puedeApadrinar es false para un administrador o un refugio: ven los planes pero no el botón.
// Tampoco hay botón si al animal no le quedan cupos disponibles.
const ElegirPlan = ({ animal, onError }) => {
  const navigate = useNavigate()
  const { usuario, puedeApadrinar } = useSesion()
  const { agregar } = useMuelle()
  const planesBase = usePlanes()
  const planes = planesDe(animal, planesBase)

  const [planElegido, setPlanElegido] = useState('') // '' = todavía no eligió: vale el primero de la lista
  const codigoElegido = planElegido === '' ? planes[0]?.codigo : planElegido

  const sinCupos = animal.cuposDisponibles === 0

  const handleAgregar = () => {
    if (!usuario) {
      navigate('/panel', { state: { pendiente: { idAnimal: animal.id, codigoPlan: codigoElegido } } })
      return
    }
    onError(null)
    agregar(animal.id, codigoElegido)
      .then(() => {
        navigate('/muelle')
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Elegí tu nivel de custodia</h2>
      <p className={`font-label-lg text-label-lg ${sinCupos ? 'text-error' : 'text-secondary'}`}>
        {sinCupos ? 'Sin cupos disponibles por ahora' : `Quedan ${animal.cuposDisponibles} de ${animal.cuposTotales} cupos. En el muelle elegís cuántos tomar.`}
      </p>

      {planes.map((plan) => (
        <label
          key={plan.codigo}
          htmlFor={`plan-${plan.codigo}`}
          className={`flex items-start gap-space-md p-space-md rounded-xl cursor-pointer ${
            plan.codigo === codigoElegido ? 'ring-2 ring-primary bg-surface-container-lowest' : 'bg-surface-container-low'
          }`}
        >
          <input
            type="radio"
            id={`plan-${plan.codigo}`}
            name="plan"
            checked={plan.codigo === codigoElegido}
            onChange={() => setPlanElegido(plan.codigo)}
            className="mt-1 accent-primary"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-title-lg text-title-lg text-on-surface">{plan.nombre}</span>
              <span className="font-headline-sm text-headline-sm text-primary"><Precio valor={plan.precio} />/mes</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.texto}</p>
          </div>
        </label>
      ))}

      {puedeApadrinar && sinCupos && (
        <p className="bg-surface-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-center text-on-surface-variant">
          {animal.nombre} ya tiene todos sus cupos tomados. Guardalo en favoritos para volver más adelante.
        </p>
      )}
      {puedeApadrinar && !sinCupos && (
        <button onClick={handleAgregar} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-space-md rounded-full hover:bg-tertiary-container">
          Apadrinar a {animal.nombre}
        </button>
      )}
      {!puedeApadrinar && (
        <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-center">
          Las cuentas de administrador y de refugio no pueden apadrinar.
        </p>
      )}
    </div>
  )
}

export default ElegirPlan
