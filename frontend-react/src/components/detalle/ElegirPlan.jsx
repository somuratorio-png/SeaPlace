import { useState } from 'react'
import { planesDe } from '../../utils/precios'
import Precio from '../comunes/Precio'

// Muestra los 3 niveles de apadrinamiento. El precio de cada uno sale de la cuota del animal
// (con el descuento ya aplicado si está en oferta).
// puedeApadrinar es false para un administrador o un refugio: ven los planes pero no el botón.
const ElegirPlan = ({ animal, puedeApadrinar, onAgregar }) => {
  const planes = planesDe(animal)

  // Guardamos el nombre del plan elegido; arranca en el del medio
  const [planElegido, setPlanElegido] = useState('Guardián de la Bahía')

  const agregar = () => {
    const plan = planes.find((p) => p.nombre === planElegido)
    onAgregar(animal, plan)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Elegí tu nivel de custodia</h2>

      {planes.map((plan) => (
        <label
          key={plan.nombre}
          className={`flex items-start gap-space-md p-space-md rounded-xl cursor-pointer ${
            plan.nombre === planElegido ? 'ring-2 ring-primary bg-surface-container-lowest' : 'bg-surface-container-low'
          }`}
        >
          <input
            type="radio"
            name="plan"
            checked={plan.nombre === planElegido}
            onChange={() => setPlanElegido(plan.nombre)}
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

      {puedeApadrinar ? (
        <button onClick={agregar} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-space-md rounded-full hover:bg-tertiary-container">
          Apadrinar a {animal.nombre}
        </button>
      ) : (
        <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-center">
          Las cuentas de administrador y de refugio no pueden apadrinar.
        </p>
      )}
    </div>
  )
}

export default ElegirPlan
