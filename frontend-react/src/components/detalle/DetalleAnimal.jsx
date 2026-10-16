import { Navigate, useParams, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import BarraProgreso from '../comunes/BarraProgreso'
import FavoritoAnimal from '../comunes/FavoritoAnimal'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import PrecioAnimal from '../comunes/PrecioAnimal'
import ElegirPlan from './ElegirPlan'
import Galeria from './Galeria'
import PreguntasFrecuentes from './PreguntasFrecuentes'
import { traerAnimal } from '../../services/animales'
import { useConsulta } from '../../hooks/useConsulta'
import { useState } from 'react'

// La ficha de un animal. Lo pide al backend cuando se monta, con el id que sale de la URL (/animal/:id).
const DetalleAnimal = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const { datos: animal, cargando, error, estadoError } = useConsulta(traerAnimal, id)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  if (cargando) {
    return <Cargando texto="Buscando al animal…" />
  }

  if (estadoError === 404) {
    return <Navigate to="/catalogo" replace />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
        <AvisoError mensaje={error} />
        <button onClick={() => navigate('/catalogo')} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          <Icono nombre="arrow_back" clase="text-[18px]" /> Volver al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
      <button onClick={() => navigate('/catalogo')} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
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
          <div className="flex items-start justify-between gap-space-md">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                {animal.especie} · {animal.edad} · {animal.ubicacion}
              </span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
              <PrecioAnimal animal={animal} />
            </div>
              <FavoritoAnimal animal={animal} onError={setErrorAccion} />
          </div>
            <ElegirPlan animal={animal} onError={setErrorAccion} />
        </div>
      </div>

      <PreguntasFrecuentes nombre={animal.nombre} />
    </div>
  )
}

export default DetalleAnimal
