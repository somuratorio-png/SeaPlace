import BotonFavorito from '../comunes/BotonFavorito'
import PrecioAnimal from '../comunes/PrecioAnimal'

// Un animal guardado en favoritos, todavía sin apadrinar
const TarjetaFavorito = ({ animal, onVer, onQuitar }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-center gap-space-md transition hover:shadow-md">
      <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-20 h-20 object-cover rounded-xl" />
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="font-title-lg text-title-lg text-primary">{animal.nombre}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{animal.especie}</p>
        <PrecioAnimal animal={animal} />
      </div>
      <div className="flex flex-col items-end gap-space-sm">
        <BotonFavorito esFavorito onCambiar={onQuitar} />
        <button onClick={onVer} className="font-label-lg text-label-lg text-secondary hover:underline">
          Ver ficha
        </button>
      </div>
    </div>
  )
}

export default TarjetaFavorito
