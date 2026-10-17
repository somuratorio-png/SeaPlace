import { useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BotonVolver from '../comunes/BotonVolver'
import Cargando from '../comunes/Cargando'
import ErrorConVolver from '../comunes/ErrorConVolver'
import ElegirPlan from './ElegirPlan'
import EncabezadoAnimal from './EncabezadoAnimal'
import HistoriaAnimal from './HistoriaAnimal'
import PreguntasFrecuentes from './PreguntasFrecuentes'
import { traerAnimal } from '../../services/animales'
import { useConsulta } from '../../hooks/useConsulta'

// La ficha de un animal. Lo pide al backend cuando se monta, con el id que sale de la URL (/animal/:id).
const DetalleAnimal = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { datos: animal, cargando, error, estadoError } = useConsulta(traerAnimal, id)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  const volverAlCatalogo = () => {
    navigate('/catalogo')
  }

  if (cargando) {
    return <Cargando texto="Buscando al animal…" />
  }

  if (estadoError === 404) {
    return <Navigate to="/catalogo" replace />
  }

  if (error) {
    return <ErrorConVolver mensaje={error} textoVolver="Volver al catálogo" onVolver={volverAlCatalogo} />
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
      <BotonVolver texto="Volver al catálogo" onVolver={volverAlCatalogo} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <HistoriaAnimal animal={animal} />

        <div className="lg:col-span-5 space-y-space-md">
          <EncabezadoAnimal animal={animal} onError={setErrorAccion} />
          <ElegirPlan animal={animal} onError={setErrorAccion} />
        </div>
      </div>

      <PreguntasFrecuentes nombre={animal.nombre} />
    </div>
  )
}

export default DetalleAnimal