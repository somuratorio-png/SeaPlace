import TarjetaAnimal from './TarjetaAnimal'
import MensajeVacio from '../comunes/MensajeVacio'

const ResultadosCatalogo = ({ animales, cantidadEncontrados, hayPublicados, onError, onVer }) => {
  return (
    <>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Mostrando {animales.length} de {cantidadEncontrados} animales
      </p>

      {animales.length === 0 ? (
        <MensajeVacio clase="py-space-xl">
          {hayPublicados ? 'Ningún animal coincide con esos filtros. Probá con otra búsqueda.' : 'Todavía no hay animales publicados para apadrinar.'}
        </MensajeVacio>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {animales.map((animal) => (
            <TarjetaAnimal key={animal.id} animal={animal} onError={onError} onVer={() => onVer(animal.id)} />
          ))}
        </div>
      )}
    </>
  )
}

export default ResultadosCatalogo