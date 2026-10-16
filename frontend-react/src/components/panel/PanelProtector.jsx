import { useState } from 'react'
import AvisoError from '../comunes/AvisoError'
import Buscador from '../comunes/Buscador'
import EstadoCarga from '../comunes/EstadoCarga'
import Portada from '../comunes/Portada'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaApadrinado from './TarjetaApadrinado'
import TarjetaFavorito from './TarjetaFavorito'
import { useApadrinamientos } from '../../hooks/useApadrinamientos'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFavoritos } from '../../hooks/useFavoritos'
import { useSesion } from '../../hooks/useSesion'
import { paraBuscar } from '../../utils/texto'
import MensajeVacio from '../comunes/MensajeVacio'

// Área del protector: muestra los animales que el usuario ya apadrinó y sus favoritos.
const PanelProtector = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { usuario } = useSesion()
  const { favoritos } = useFavoritos()

  const { datos: apadrinamientos, cargando, error } = useApadrinamientos()
  const [busqueda, setBusqueda] = useState('')
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló
  
  // Los favoritos que se muestran son los que siguen publicados
  const animalesFavoritos = favoritos.filter((animal) => animal.publicacion === 'ACTIVA')

  // El backend manda también los cancelados (para el historial): acá se muestran los activos
  const apadrinados = apadrinamientos.filter((a) => a.activo)

  const texto = paraBuscar(busqueda)
  const visibles = apadrinados.filter((item) => paraBuscar(`${item.animal.nombre} ${item.animal.especie} ${item.animal.ubicacion}`).includes(texto))
  
  // La sección de apadrinados: el aviso de espera, el error del backend, el mensaje de lista vacía o las tarjetas
  const elegirApadrinados = () => {
    if (cargando || error) {
      return <EstadoCarga cargando={cargando} error={error} texto="Cargando a tus apadrinados…" />
    }

    if (apadrinados.length === 0) {
      return (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center space-y-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">Todavía no apadrinaste a ningún animal.</p>
          <button onClick={() => navigate('/catalogo')} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
            Elegir un animal
          </button>
        </div>
      )
    }
    return (
      <>
        <Buscador valor={busqueda} onCambiar={setBusqueda} textoAyuda="Buscar entre tus apadrinados..." />

        {visibles.length === 0 && (
          <MensajeVacio clase="py-space-lg">Ningún apadrinado coincide con esa búsqueda.</MensajeVacio>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibles.map((item) => (
            <TarjetaApadrinado key={item.id} item={item} onVer={(item) => navigate(`/panel/${item.animal.id}`)} />
          ))}
        </div>
      </>
    )
  }

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
        
        <section className="space-y-space-md">
          <TituloSeccion>Tus apadrinados</TituloSeccion>
          {elegirApadrinados()}
        </section>

        <section className="space-y-space-md">
          <TituloSeccion>Tus favoritos</TituloSeccion>

          {animalesFavoritos.length === 0 ? (
            <MensajeVacio clase="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg">Tocá el corazón de un animal en el catálogo para guardarlo acá.</MensajeVacio>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {animalesFavoritos.map((animal) => (
                <TarjetaFavorito
                  key={animal.id}
                  animal={animal}
                  onError={setErrorAccion}
                  onVer={() => navigate(`/animal/${animal.id}`)}
                  />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default PanelProtector
