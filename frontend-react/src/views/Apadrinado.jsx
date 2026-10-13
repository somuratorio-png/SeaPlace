import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AvisoError from '../components/comunes/AvisoError'
import BarraProgreso from '../components/comunes/BarraProgreso'
import Icono from '../components/comunes/Icono'
import Galeria from '../components/detalle/Galeria'
import Bitacora from '../components/panel/Bitacora'
import FichaAnimal from '../components/panel/FichaAnimal'
import GestionPlan from '../components/panel/GestionPlan'
import HistorialPagos from '../components/panel/HistorialPagos'
import MiPlan from '../components/panel/MiPlan'
import Rastreo from '../components/panel/Rastreo'
import RastreoBloqueado from '../components/panel/RastreoBloqueado'
import { traerNovedades } from '../services/animales'
import { cambiarPlan, cancelarApadrinamiento } from '../services/apadrinar'
import { formatearFecha } from '../utils/fechas'

// Detalle de un animal que el usuario ya apadrinó.
// "apadrinamientos" son los que ya tiene App; esta página pide al backend, al montarse, la bitácora del animal.
// onGuardarApadrinamiento le pasa a App el apadrinamiento como quedó después de cambiarle el plan o cancelarlo,
// onGuardarAnimal el animal como quedó después de cancelar (recupera sus cupos) y
// onError muestra arriba de la página el mensaje de una acción que falló.
const Apadrinado = ({ apadrinamientos, onVolver, onVerCertificado, onGuardarApadrinamiento, onGuardarAnimal, onError }) => {
  // El id sale de la URL (/panel/:id) y con eso se busca entre los apadrinados
  const { id } = useParams()
  const idAnimal = Number(id)

  const [susNovedades, setSusNovedades] = useState([])
  const [errorNovedades, setErrorNovedades] = useState(null)

  // La bitácora depende del animal: se pide al abrir la página (y de nuevo si se pasa a otro animal)
  useEffect(() => {
    traerNovedades(idAnimal)
      .then((novedades) => {
        setSusNovedades(novedades)
      })
      .catch((falla) => {
        setErrorNovedades(falla.message)
      })
  }, [idAnimal])

  // El cambio se ve con lo que contesta el backend: el apadrinamiento con su plan nuevo
  const elegirPlan = (idApadrinamiento, planNuevo) => {
    onError(null)
    cambiarPlan(idApadrinamiento, planNuevo.codigo)
      .then(onGuardarApadrinamiento)
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // No se borra: queda inactivo, así el historial no se pierde.
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelar = (idApadrinamiento) => {
    onError(null)
    cancelarApadrinamiento(idApadrinamiento)
      .then((cancelado) => {
        onGuardarApadrinamiento(cancelado)
        onGuardarAnimal(cancelado.animal)
        onVolver()
      })
      .catch((falla) => {
        onError(falla.message)
      })
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

          {errorNovedades ? <AvisoError mensaje={errorNovedades} /> : <Bitacora nombre={animal.nombre} novedades={susNovedades} />}
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
      {plan.ubicacionEnVivo ? <Rastreo key={animal.id} animal={animal} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default Apadrinado
