import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaFavorito from './TarjetaFavorito'

const SeccionFavoritos = ({ animales, onError, onVer }) => {
  return (
    <section className="space-y-space-md">
      <TituloSeccion>Tus favoritos</TituloSeccion>

      {animales.length === 0 ? (
        <MensajeVacio clase="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg">Tocá el corazón de un animal en el catálogo para guardarlo acá.</MensajeVacio>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          {animales.map((animal) => (
            <TarjetaFavorito key={animal.id} animal={animal} onError={onError} onVer={() => onVer(animal.id)} />
          ))}
        </div>
      )}
    </section>
  )
}

export default SeccionFavoritos