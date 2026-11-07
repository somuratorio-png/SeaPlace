import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BotonVolver from '../comunes/BotonVolver'
import Cargando from '../comunes/Cargando'
import ErrorConVolver from '../comunes/ErrorConVolver'
import HistoriaApadrinado from './HistoriaApadrinado'
import Rastreo from './Rastreo'
import RastreoBloqueado from './RastreoBloqueado'
import ResumenApadrinado from './ResumenApadrinado'
import { cancelarApadrinamiento, limpiarError, traerApadrinamientos } from '../../Redux/apadrinamientosSlice'
import { intentar } from '../../utils/intentar'

// Detalle de un animal que el usuario ya apadrinó.
// Esta página pide al backend, al montarse, los apadrinamientos del usuario: cada uno trae la bitácora
// y la última ubicación de su animal, así que alcanza con ese pedido.
// Si una acción falla, el mensaje se muestra arriba de la página.
const DetalleApadrinado = () => {
  // El id sale de la URL (/panel/:id) y con eso se busca entre los apadrinados
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const { items: apadrinamientos, loading, error, errorAccion } = useSelector((state) => state.apadrinamientos)
  // false hasta que termina el pedido de esta página: con la lista vieja del estado global
  // podría parecer que el animal no está apadrinado y mandar al usuario al panel
  const [listo, setListo] = useState(false)

  useEffect(() => {
    dispatch(limpiarError())
    dispatch(traerApadrinamientos()).then(() => {
      setListo(true)
    })
  }, [dispatch])

  const item = apadrinamientos.find((a) => a.activo && a.animal.id === Number(id))

  // No se borra: queda inactivo, así el historial no se pierde.
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelar = (idApadrinamiento) => {
    intentar(dispatch(cancelarApadrinamiento(idApadrinamiento))).then((mensaje) => {
      if (mensaje === null) {
        navigate('/panel')
      }
    })
  }

  if (loading || !listo) {
    return <Cargando texto="Buscando a tu apadrinado…" />
  }

  if (error) {
    return <ErrorConVolver mensaje={error} textoVolver="Volver a mis apadrinados" onVolver={() => navigate('/panel')} />
  }

  // Si ese animal no está apadrinado (o se canceló), se vuelve al panel
  if (!item) {
    return <Navigate to="/panel" replace />
  }

  const { animal, plan } = item

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => dispatch(limpiarError())} />}
      <BotonVolver texto="Volver a mis apadrinados" onVolver={() => navigate('/panel')} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <HistoriaApadrinado animal={animal} novedades={item.novedades} />
        <ResumenApadrinado
          item={item}
          onVerCertificado={() => navigate(`/panel/${animal.id}/certificado`)}
          onCancelar={cancelar}
        />
      </div>

      {/* La ubicación solo se muestra con el plan más alto. Va a todo el ancho para que el mapa luzca. */}
      {plan.ubicacionEnVivo ? <Rastreo key={animal.id} animal={animal} posicion={item.ultimaUbicacion} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default DetalleApadrinado
