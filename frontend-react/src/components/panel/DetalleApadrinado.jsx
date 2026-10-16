import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BarraProgreso from '../comunes/BarraProgreso'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import Galeria from '../comunes/Galeria'
import Bitacora from './Bitacora'
import FichaAnimal from './FichaAnimal'
import GestionPlan from './GestionPlan'
import HistorialPagos from './HistorialPagos'
import MiPlan from './MiPlan'
import Rastreo from './Rastreo'
import RastreoBloqueado from './RastreoBloqueado'
import { cambiarPlan, cancelarApadrinamiento } from '../../services/apadrinar'
import { formatearFecha } from '../../utils/fechas'
import { ponerEn } from '../../utils/listas'
import { useApadrinamientoDe } from '../../hooks/useApadrinamientoDe'
import BotonVolver from '../comunes/BotonVolver'

// Detalle de un animal que el usuario ya apadrinó.
// Esta página pide al backend, al montarse, los apadrinamientos del usuario: cada uno trae la bitácora
// y la última ubicación de su animal, así que alcanza con ese pedido.
// onError muestra arriba de la página el mensaje de una acción que falló.
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
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
        <AvisoError mensaje={error} />
        <BotonVolver texto="Volver a mis apadrinados" onVolver={() => navigate('/panel')} />
      </div>
    )
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
        <div className="lg:col-span-7 space-y-space-lg">
          <Galeria fotos={animal.fotos} nombre={animal.nombre} />

          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-primary">Su historia</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
          </div>

          <Bitacora nombre={animal.nombre} novedades={item.novedades} />
        </div>

        <div className="lg:col-span-5 space-y-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
              Tu apadrinado desde el {formatearFecha(item.desde)}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
          </div>

          <button
            onClick={() => navigate(`/panel/${item.animal.id}/certificado`)}
            className="w-full inline-flex items-center justify-center gap-1 bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full shadow-md hover:bg-tertiary-container"
          >
            <Icono nombre="workspace_premium" clase="text-[20px]" /> Ver mi certificado
          </button>

          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface">Cómo viene</h2>
            <p className="font-label-lg text-label-lg text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
            <BarraProgreso porcentaje={animal.progreso} />
          </div>

          <FichaAnimal animal={animal} />
          <MiPlan plan={plan} cupos={item.cupos} />
          <HistorialPagos pagos={item.pagos} />
          <GestionPlan item={item} onCambiarPlan={elegirPlan} onCancelar={cancelar} />
        </div>
      </div>

      {/* La ubicación solo se muestra con el plan más alto. Va a todo el ancho para que el mapa luzca. */}
      {plan.ubicacionEnVivo ? <Rastreo key={animal.id} animal={animal} posicion={item.ultimaUbicacion} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default DetalleApadrinado
