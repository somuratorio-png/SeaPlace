import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMuelle } from '../../hooks/useMuelle'
import { usePlanes } from '../../hooks/usePlanes'
import { useSesion } from '../../hooks/useSesion'
import { planesDe } from '../../utils/precios'
import AccionApadrinar from './AccionApadrinar'
import OpcionPlan from './OpcionPlan'

const ElegirPlan = ({ animal, onError }) => {
  const navigate = useNavigate()
  const { usuario, puedeApadrinar } = useSesion()
  const { agregar } = useMuelle()
  const planesBase = usePlanes()
  const planes = planesDe(animal, planesBase)

  const [planElegido, setPlanElegido] = useState('')
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
        <OpcionPlan key={plan.codigo} plan={plan} elegido={plan.codigo === codigoElegido} onElegir={() => setPlanElegido(plan.codigo)} />
      ))}

      <AccionApadrinar animal={animal} puedeApadrinar={puedeApadrinar} sinCupos={sinCupos} onApadrinar={handleAgregar} />
    </div>
  )
}

export default ElegirPlan
