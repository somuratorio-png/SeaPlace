import { Navigate, useParams } from 'react-router-dom'
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
import { formatearFecha } from '../utils/fechas'

// Detalle de un animal que el usuario ya apadrinó.
// apadrinados = [{ id, animal, plan, desde, pagos }] y novedades = las de todos los animales
const Apadrinado = ({ apadrinados, novedades, onVolver, onCambiarPlan, onCancelar, onVerCertificado }) => {
  // El id sale de la URL (/panel/:id) y con eso se busca entre los apadrinados
  const { id } = useParams()
  const item = apadrinados.find((a) => a.animal.id === id)

  // Si ese animal no está apadrinado (o se canceló), se vuelve al panel
  if (!item) {
    return <Navigate to="/panel" replace />
  }

  const { animal, plan } = item
  const susNovedades = novedades.filter((novedad) => novedad.animalId === animal.id)

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

          <Bitacora nombre={animal.nombre} novedades={susNovedades} />
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
          <GestionPlan item={item} onCambiarPlan={onCambiarPlan} onCancelar={onCancelar} />
        </div>
      </div>

      {/* La ubicación solo se muestra con el plan más alto. Va a todo el ancho para que el mapa luzca. */}
      {plan.ubicacionEnVivo ? <Rastreo animal={animal} /> : <RastreoBloqueado nombre={animal.nombre} />}
    </div>
  )
}

export default Apadrinado
