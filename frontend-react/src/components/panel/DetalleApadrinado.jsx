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

// Detalle de un animal que el usuario ya apadrinó.
// Esta página pide al backend, al montarse, los apadrinamientos del usuario: cada uno trae la bitácora
// y la última ubicación de su animal, así que alcanza con ese pedido.
// Si una acción falla, el mensaje se muestra arriba de la página.
const DetalleApadrinado = () => {
  // El id sale de la URL (/panel/:id) y con eso se busca entre los apadrinados
  const navigate = useNavigate()
  const { id } = useParams()

  const { item, setApadrinamientos, cargando, error } = useApadrinamientoDe(id)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // El cambio se ve con lo que contesta el backend: el apadrinamiento con su plan nuevo
  const elegirPlan = (idApadrinamiento, planNuevo) => {
    setErrorAccion(null)
    cambiarPlan(idApadrinamiento, planNuevo.codigo)
      .then((cambiado) => {
        setApadrinamientos((actuales) => ponerEn(actuales, cambiado))
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  // No se borra: queda inactivo, así el historial no se pierde.
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelar = (idApadrinamiento) => {
    setErrorAccion(null)
    cancelarApadrinamiento(idApadrinamiento)
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

  // Si ese animal no está apadrinado (o se canceló), se vuelve al panel
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

      {/* La ubicación solo se muestra con el plan más alto. Va a todo el ancho para que el mapa luzca. */}
      {plan.ubicacionEnVivo ? <Rastreo key={animal.id} animal={animal} posicion={item.ultimaUbicacion} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default DetalleApadrinado