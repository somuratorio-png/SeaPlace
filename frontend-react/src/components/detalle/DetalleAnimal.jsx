import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BotonVolver from '../comunes/BotonVolver'
import Cargando from '../comunes/Cargando'
import ErrorConVolver from '../comunes/ErrorConVolver'
import ElegirPlan from './ElegirPlan'
import EncabezadoAnimal from './EncabezadoAnimal'
import HistoriaAnimal from './HistoriaAnimal'
import PreguntasFrecuentes from './PreguntasFrecuentes'
import { traerAnimal } from '../../Redux/animalesSlice'

// La ficha de un animal. Lo pide al backend cuando se monta, con el id que sale de la URL (/animal/:id).
// Si no existe (o su publicación no está activa y no es de quien la pide) el backend responde 404 y se vuelve al catálogo.
const DetalleAnimal = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const { animal, loading, error } = useSelector((state) => state.animales)
  // false hasta que termina el pedido de esta ficha: así no se muestra un rato el animal (o el error)
  // que había quedado en el estado global de una ficha anterior
  const [listo, setListo] = useState(false)
  const [noExiste, setNoExiste] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // El id es parte de las dependencias: si cambia, se pide el otro animal.
  // dispatch devuelve la action con la que terminó: la "rejected" trae en action.payload el error del backend,
  // cuyo status es 404 cuando ese animal no existe.
  useEffect(() => {
    dispatch(traerAnimal(id)).then((accion) => {
      setNoExiste(accion.payload !== undefined && accion.payload.status === 404)
      setListo(true)
    })
  }, [dispatch, id])

  const volverAlCatalogo = () => {
    navigate('/catalogo')
  }

  if (loading || !listo) {
    return <Cargando texto="Buscando al animal…" />
  }

  if (noExiste) {
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
