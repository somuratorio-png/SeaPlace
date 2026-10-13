import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AvisoError from '../components/comunes/AvisoError'
import BarraProgreso from '../components/comunes/BarraProgreso'
import Cargando from '../components/comunes/Cargando'
import Icono from '../components/comunes/Icono'
import Galeria from '../components/detalle/Galeria'
import Bitacora from '../components/panel/Bitacora'
import FichaAnimal from '../components/panel/FichaAnimal'
import GestionPlan from '../components/panel/GestionPlan'
import HistorialPagos from '../components/panel/HistorialPagos'
import MiPlan from '../components/panel/MiPlan'
import Rastreo from '../components/panel/Rastreo'
import RastreoBloqueado from '../components/panel/RastreoBloqueado'
import { cambiarPlan, cancelarApadrinamiento, traerApadrinamientos } from '../services/apadrinar'
import { formatearFecha } from '../utils/fechas'
import { ponerEn } from '../utils/listas'

// Detalle de un animal que el usuario ya apadrinó.
// Esta página pide al backend, al montarse, los apadrinamientos del usuario: cada uno trae la bitácora
// y la última ubicación de su animal, así que alcanza con ese pedido.
// onError muestra arriba de la página el mensaje de una acción que falló.
const Apadrinado = ({ onVolver, onVerCertificado, onError }) => {
  // El id sale de la URL (/panel/:id) y con eso se busca entre los apadrinados
  const { id } = useParams()
  const idAnimal = Number(id)

  const [apadrinamientos, setApadrinamientos] = useState([]) // [{ id, animal, plan, desde, pagos, activo, novedades, ultimaUbicacion }]
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Un solo pedido, al abrir la página
  useEffect(() => {
    traerApadrinamientos()
      .then((lista) => {
        setApadrinamientos(lista)
      })
      .catch((falla) => {
        setError(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  // El cambio se ve con lo que contesta el backend: el apadrinamiento con su plan nuevo
  const elegirPlan = (idApadrinamiento, planNuevo) => {
    onError(null)
    cambiarPlan(idApadrinamiento, planNuevo.codigo)
      .then((cambiado) => {
        setApadrinamientos((actuales) => ponerEn(actuales, cambiado))
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // No se borra: queda inactivo, así el historial no se pierde.
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelar = (idApadrinamiento) => {
    onError(null)
    cancelarApadrinamiento(idApadrinamiento)
      .then(() => {
        onVolver()
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  if (cargando) {
    return <Cargando texto="Buscando a tu apadrinado…" />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
        <AvisoError mensaje={error} />
        <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          <Icono nombre="arrow_back" clase="text-[18px]" /> Volver a mis apadrinados
        </button>
      </div>
    )
  }

  const item = apadrinamientos.find((a) => a.activo && a.animal.id === idAnimal)

  // Si ese animal no está apadrinado (o se canceló), se vuelve al panel
  if (!item) {
    return <Navigate to="/panel" replace />
  }

  const { animal, plan } = item

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
        <Icono nombre="arrow_back" clase="text-[18px]" /> Volver a mis apadrinados
      </button>

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
            onClick={() => onVerCertificado(item)}
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

export default Apadrinado
