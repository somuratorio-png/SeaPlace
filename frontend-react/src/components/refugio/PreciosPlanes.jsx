import CampoTexto from '../comunes/CampoTexto'
import { usePlanes } from '../../hooks/usePlanes'

const CAMPO_DEL_PLAN = {
  BRISA_MARINA: 'precioBrisa',
  GUARDIAN_DE_LA_BAHIA: 'precio',
  MAREA_PROFUNDA: 'precioMarea',
}

const PreciosPlanes = ({ datos, onCambiar }) => {
  const planes = usePlanes()

  return (
    <fieldset className="space-y-space-sm">
      <legend className="font-label-lg text-label-lg text-on-surface">¿Cuánto cuesta acompañarlo cada mes?</legend>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Cada plan suma beneficios al anterior, así que va de menor a mayor. El de Guardián de la Bahía es el que se muestra en el catálogo. Montos en US$.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {planes.map((plan) => (
          <div key={plan.codigo} className="space-y-1">
            <CampoTexto etiqueta={plan.nombre} nombre={CAMPO_DEL_PLAN[plan.codigo]} tipo="number" valor={datos[CAMPO_DEL_PLAN[plan.codigo]]} onCambiar={onCambiar} />
            <p className="font-body-sm text-body-sm text-on-surface-variant">{plan.texto}</p>
          </div>
        ))}
      </div>
    </fieldset>
  )
}

export default PreciosPlanes
