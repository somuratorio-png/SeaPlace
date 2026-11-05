import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { agregarAlMuelle } from '../../Redux/muelleSlice'
import { intentar } from '../../utils/intentar'
import { planesDe } from '../../utils/precios'
import { puedeApadrinar } from '../../utils/roles'
import AccionApadrinar from './AccionApadrinar'
import OpcionPlan from './OpcionPlan'

// Muestra los 3 niveles de apadrinamiento (los que manda el backend). El precio de cada uno sale
// de la cuota del animal (con el descuento ya aplicado si está en oferta).
// puedeApadrinar es false para un administrador o un refugio: ven los planes pero no el botón.
// Tampoco hay botón si al animal no le quedan cupos disponibles.
const ElegirPlan = ({ animal, onError }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { items: planesBase } = useSelector((state) => state.planes)
  const planes = planesDe(animal, planesBase)

  const [planElegido, setPlanElegido] = useState('') // '' = todavía no eligió: vale el primero de la lista
  const codigoElegido = planElegido === '' && planes.length > 0 ? planes[0].codigo : planElegido

  const sinCupos = animal.cuposDisponibles === 0

  const handleAgregar = () => {
    if (!usuario) {
      navigate('/panel', { state: { pendiente: { idAnimal: animal.id, codigoPlan: codigoElegido } } })
      return
    }
    onError(null)
    intentar(dispatch(agregarAlMuelle({ idAnimal: animal.id, codigoPlan: codigoElegido })), onError).then((mensaje) => {
      if (mensaje === null) {
        navigate('/muelle')
      }
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

      <AccionApadrinar animal={animal} puedeApadrinar={puedeApadrinar(usuario)} sinCupos={sinCupos} onApadrinar={handleAgregar} />
    </div>
  )
}

export default ElegirPlan
