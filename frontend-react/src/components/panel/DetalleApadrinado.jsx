import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BotonVolver from '../comunes/BotonVolver'
import Cargando from '../comunes/Cargando'
import ErrorConVolver from '../comunes/ErrorConVolver'
import HistoriaApadrinado from './HistoriaApadrinado'
import Rastreo from './Rastreo'
import RastreoBloqueado from './RastreoBloqueado'
import ResumenApadrinado from './ResumenApadrinado'
import { cambiarPlan, cancelarApadrinamiento } from '../../services/apadrinar'
import { ponerEn } from '../../utils/listas'
import { useApadrinamientoDe } from '../../hooks/useApadrinamientoDe'
import { usePlanes } from '../../hooks/usePlanes'
import { useSesion } from '../../hooks/useSesion'

const DetalleApadrinado = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { item, setApadrinamientos, cargando, error } = useApadrinamientoDe(id)
  const planes = usePlanes()
  const { token } = useSesion()
  const [errorAccion, setErrorAccion] = useState(null)

  const elegirPlan = (idApadrinamiento, planNuevo) => {
    setErrorAccion(null)
    cambiarPlan(token, planes, idApadrinamiento, planNuevo.codigo)
      .then((cambiado) => {
        setApadrinamientos((actuales) => ponerEn(actuales, cambiado))
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  const cancelar = (idApadrinamiento) => {
    setErrorAccion(null)
    cancelarApadrinamiento(token, planes, idApadrinamiento)
      .then(() => {
        navigate('/panel')
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  if (cargando) {
    return <Cargando texto="Buscando a tu apadrinado…" />
  }

  if (error) {
    return <ErrorConVolver mensaje={error} textoVolver="Volver a mis apadrinados" onVolver={() => navigate('/panel')} />
  }

  if (!item) {
    return <Navigate to="/panel" replace />
  }

  const { animal, plan } = item

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
      <BotonVolver texto="Volver a mis apadrinados" onVolver={() => navigate('/panel')} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <HistoriaApadrinado animal={animal} novedades={item.novedades} />
        <ResumenApadrinado
          item={item}
          onVerCertificado={() => navigate(`/panel/${animal.id}/certificado`)}
          onCambiarPlan={elegirPlan}
          onCancelar={cancelar}
        />
      </div>

      {plan.ubicacionEnVivo ? <Rastreo key={animal.id} animal={animal} posicion={item.ultimaUbicacion} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default DetalleApadrinado