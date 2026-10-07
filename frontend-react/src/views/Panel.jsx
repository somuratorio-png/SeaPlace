import { useState } from 'react'
import Buscador from '../components/comunes/Buscador'
import Portada from '../components/comunes/Portada'
import TituloSeccion from '../components/comunes/TituloSeccion'
import TarjetaApadrinado from '../components/panel/TarjetaApadrinado'
import TarjetaFavorito from '../components/panel/TarjetaFavorito'

// Área del protector: muestra los animales que el usuario ya apadrinó y sus favoritos
const Panel = ({ usuario, apadrinados, animalesFavoritos, onFavorito, onVerCatalogo, onVerApadrinado, onVerAnimal }) => {
  const [busqueda, setBusqueda] = useState('')

  const texto = busqueda.toLowerCase()
  const visibles = apadrinados.filter((item) => `${item.animal.nombre} ${item.animal.especie} ${item.animal.ubicacion}`.toLowerCase().includes(texto))

  return (
    <>
      <Portada
        icono="favorite"
        etiqueta="Tu panel de protector"
        titulo={`¡Hola de nuevo, ${usuario.nombre}!`}
        texto={`Tenés ${apadrinados.length} ${apadrinados.length === 1 ? 'animal apadrinado' : 'animales apadrinados'}.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        <section className="space-y-space-md">
          <TituloSeccion>Tus apadrinados</TituloSeccion>

          {apadrinados.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center space-y-space-md">
              <p className="font-body-md text-body-md text-on-surface-variant">Todavía no apadrinaste a ningún animal.</p>
              <button onClick={onVerCatalogo} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
                Elegir un animal
              </button>
            </div>
          ) : (
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
          )}
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
