import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
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

// La ficha de un animal. Lo pide al backend cuando se monta, con el id que sale de la URL (/animal/:id).
// "favoritos" son los ids de los animales que guardó el usuario, que tiene App.
const DetalleAnimal = ({ usuario, favoritos, onCambiarFavoritos, onError, muelle, onCambiarMuelle, puedeApadrinar, onVolver }) => {
  const { id } = useParams()

  const [animal, setAnimal] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [noExiste, setNoExiste] = useState(false)

  // Un solo pedido, al abrir la página (cada animal tiene su URL, así que cambia solo con el id)
  useEffect(() => {
    traerAnimal(id)
      .then((encontrado) => {
        setAnimal(encontrado)
      })
      .catch((falla) => {
        // 404 = ese animal no existe o su publicación ya no está activa
        if (falla.estado === 404) {
          setNoExiste(true)
        } else {
          setError(falla.message)
        }
      })
      .then(() => {
        setCargando(false)
      })
  }, [id])

  if (cargando) {
    return <Cargando texto="Buscando al animal…" />
  }

  if (noExiste) {
    return <Navigate to="/catalogo" replace />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
        <AvisoError mensaje={error} />
        <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          <Icono nombre="arrow_back" clase="text-[18px]" /> Volver al catálogo
        </button>
      </div>
    )
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
          <div className="flex items-start justify-between gap-space-md">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                {animal.especie} · {animal.edad} · {animal.ubicacion}
              </span>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
              <PrecioAnimal animal={animal} />
            </div>
              <FavoritoAnimal animal={animal} usuario={usuario} favoritos={favoritos} onCambiarFavoritos={onCambiarFavoritos} onError={onError} />
          </div>
            <ElegirPlan animal={animal} usuario={usuario} muelle={muelle} onCambiarMuelle={onCambiarMuelle} onError={onError} puedeApadrinar={puedeApadrinar} />
        </div>
      </div>

      <PreguntasFrecuentes nombre={animal.nombre} />
    </div>
  )
}

export default DetalleAnimal
