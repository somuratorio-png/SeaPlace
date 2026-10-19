import CampoTexto from '../comunes/CampoTexto'
import { usePlanes } from '../../hooks/usePlanes'

// Qué campo del formulario guarda el precio de cada plan. El de Guardián de la Bahía es "precio":
// es la cuota que se muestra en el catálogo.
const CAMPO_DEL_PLAN = {
  BRISA_MARINA: 'precioBrisa',
  GUARDIAN_DE_LA_BAHIA: 'precio',
  MAREA_PROFUNDA: 'precioMarea',
}

// Un precio por cada plan de apadrinamiento, de menor a mayor (cada plan incluye lo del anterior).
// Los planes (nombre y qué incluye) vienen del backend; ver contexto/Planes.js.
const PreciosPlanes = ({ datos, onCambiar }) => {
  const planes = usePlanes()

  return (
    <fieldset className="space-y-space-sm">
      <legend className="font-label-lg text-label-lg text-on-surface">Cuota mensual de cada plan (en US$)</legend>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Cada plan incluye lo del anterior, así que tiene que costar más. La del medio es la que se ve en el catálogo.</p>
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
