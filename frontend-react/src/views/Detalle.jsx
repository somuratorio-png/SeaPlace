import { Navigate, useParams } from 'react-router-dom'
import BarraProgreso from '../components/comunes/BarraProgreso'
import Icono from '../components/comunes/Icono'
import ElegirPlan from '../components/detalle/ElegirPlan'
import Galeria from '../components/detalle/Galeria'
import PreguntasFrecuentes from '../components/detalle/PreguntasFrecuentes'

const Detalle = ({ animales, puedeApadrinar, onAgregar, onVolver }) => {
  // El id sale de la URL (/animal/:id) y con eso se busca el animal
  const { id } = useParams()
  const animal = animales.find((a) => a.id === id)

  if (!animal) {
    return <Navigate to="/catalogo" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
        <Icono nombre="arrow_back" clase="text-[18px]" /> Volver al catálogo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-7 space-y-space-lg">
          <Galeria fotos={animal.fotos} nombre={animal.nombre} />

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Su historia</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
            <p className="font-label-lg text-label-lg text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
            <BarraProgreso porcentaje={animal.progreso} />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
              {animal.especie} · {animal.edad} · {animal.ubicacion}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
          </div>
          <ElegirPlan animal={animal} puedeApadrinar={puedeApadrinar} onAgregar={onAgregar} />
        </div>
      </div>

      <PreguntasFrecuentes nombre={animal.nombre} />
    </div>
  )
}

export default Detalle
