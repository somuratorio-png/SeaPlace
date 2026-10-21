import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Portada from '../comunes/Portada'
import SeccionApadrinados from './SeccionApadrinados'
import SeccionFavoritos from './SeccionFavoritos'
import { useApadrinamientos } from '../../hooks/useApadrinamientos'
import { useFavoritos } from '../../hooks/useFavoritos'
import { useSesion } from '../../hooks/useSesion'

const PanelProtector = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { usuario } = useSesion()
  const { favoritos } = useFavoritos()

  const { datos: apadrinamientos, cargando, error } = useApadrinamientos()
  const [errorAccion, setErrorAccion] = useState(null)

  const animalesFavoritos = favoritos.filter((animal) => animal.publicacion === 'ACTIVA')

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