import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Portada from '../comunes/Portada'
import SeccionApadrinados from './SeccionApadrinados'
import SeccionFavoritos from './SeccionFavoritos'
import { traerApadrinamientos } from '../../Redux/apadrinamientosSlice'

// Área del protector: muestra los animales que el usuario ya apadrinó (los pide al montarse) y sus favoritos
// (llegaron con la sesión).
const PanelProtector = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  const { usuario } = useSelector((state) => state.usuario)
  const { items: favoritos } = useSelector((state) => state.favoritos)
  const { items: apadrinamientos, loading: cargando, error } = useSelector((state) => state.apadrinamientos)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  useEffect(() => {
    dispatch(traerApadrinamientos())
  }, [dispatch])

  // Los favoritos que se muestran son los que siguen publicados
  const animalesFavoritos = favoritos.filter((animal) => animal.publicacion === 'ACTIVA')

  // El backend manda también los cancelados (para el historial): acá se muestran los activos
  const apadrinados = apadrinamientos.filter((a) => a.activo)

  return (
    <>
      <Portada
        icono="favorite"
        etiqueta="Tu panel de protector"
        titulo={`¡Hola de nuevo, ${usuario.nombre}!`}
        texto={cargando ? 'Estamos buscando a tus apadrinados.' : `Tenés ${apadrinados.length} ${apadrinados.length === 1 ? 'animal apadrinado' : 'animales apadrinados'}.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
        {/* Si al entrar no se pudo agregar al muelle el animal que se había elegido, el mensaje llega con la navegación */}
        {state !== null && state.error && <AvisoError mensaje={state.error} />}

        <SeccionApadrinados
          cargando={cargando}
          error={error}
          apadrinados={apadrinados}
          onVer={(item) => navigate(`/panel/${item.animal.id}`)}
          onElegir={() => navigate('/catalogo')}
        />
        <SeccionFavoritos animales={animalesFavoritos} onError={setErrorAccion} onVer={(id) => navigate(`/animal/${id}`)} />
      </div>
    </>
  )
}

export default PanelProtector