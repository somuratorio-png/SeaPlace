import { useEffect, useState } from 'react'
import AvisoError from '../components/comunes/AvisoError'
import Buscador from '../components/comunes/Buscador'
import Cargando from '../components/comunes/Cargando'
import Portada from '../components/comunes/Portada'
import TituloSeccion from '../components/comunes/TituloSeccion'
import TarjetaApadrinado from '../components/panel/TarjetaApadrinado'
import TarjetaFavorito from '../components/panel/TarjetaFavorito'
import { traerApadrinamientos } from '../services/apadrinar'

// Área del protector: muestra los animales que el usuario ya apadrinó y sus favoritos.
// Los apadrinamientos los pide esta página al backend cuando se monta; los favoritos son los que ya tiene App.
const Panel = ({ usuario, animalesFavoritos, onFavorito, onVerCatalogo, onVerApadrinado, onVerAnimal }) => {
  const [apadrinamientos, setApadrinamientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  // Un solo pedido, al entrar al panel
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

  // El backend manda también los cancelados (para el historial): acá se muestran los activos
  const apadrinados = apadrinamientos.filter((a) => a.activo)

  const texto = busqueda.toLowerCase()
  const visibles = apadrinados.filter((item) => `${item.animal.nombre} ${item.animal.especie} ${item.animal.ubicacion}`.toLowerCase().includes(texto))

  // La sección de apadrinados: el aviso de espera, el error del backend, el mensaje de lista vacía o las tarjetas
  const elegirApadrinados = () => {
    if (cargando) {
      return <Cargando texto="Buscando tus apadrinados…" />
    }
    if (error) {
      return <AvisoError mensaje={error} />
    }
    if (apadrinados.length === 0) {
      return (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center space-y-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">Todavía no apadrinaste a ningún animal.</p>
          <button onClick={onVerCatalogo} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
            Elegir un animal
          </button>
        </div>
      )
    }
    return (
      <>
        <Buscador valor={busqueda} onCambiar={setBusqueda} textoAyuda="Buscar entre tus apadrinados..." />

        {visibles.length === 0 && (
          <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-lg">
            Ningún apadrinado coincide con esa búsqueda.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibles.map((item) => (
            <TarjetaApadrinado key={item.id} item={item} onVer={onVerApadrinado} />
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
        <section className="space-y-space-md">
          <TituloSeccion>Tus apadrinados</TituloSeccion>
          {elegirApadrinados()}
        </section>

        <section className="space-y-space-md">
          <TituloSeccion>Tus favoritos</TituloSeccion>

          {animalesFavoritos.length === 0 ? (
            <p className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
              Tocá el corazón de un animal en el catálogo para guardarlo acá.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              {animalesFavoritos.map((animal) => (
                <TarjetaFavorito key={animal.id} animal={animal} onVer={() => onVerAnimal(animal)} onQuitar={() => onFavorito(animal.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default Panel
