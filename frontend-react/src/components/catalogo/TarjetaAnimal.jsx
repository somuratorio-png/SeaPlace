import BarraProgreso from '../comunes/BarraProgreso'
import BotonFavorito from '../comunes/BotonFavorito'
import PrecioAnimal from '../comunes/PrecioAnimal'

// Color del cartelito de estado según la urgencia del animal
const coloresUrgencia = {
  critico: 'bg-error text-on-error',
  recuperacion: 'bg-secondary text-on-secondary',
  listo: 'bg-primary text-on-primary',
}

const TarjetaAnimal = ({ animal, esFavorito, onFavorito, onVer }) => {
  // Si no le quedan cupos, no se puede apadrinar
  const sinCupos = animal.cuposDisponibles === 0

  return (
    <article className="revelar group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-full h-64 object-cover transition duration-500 group-hover:scale-105" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-md text-label-md ${coloresUrgencia[animal.urgencia]}`}>
          {animal.estado}
        </span>
        <BotonFavorito esFavorito={esFavorito} onCambiar={onFavorito} clase="absolute top-3 right-3" />
      </div>

      <div className="p-space-lg space-y-space-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-primary">{animal.nombre}</h3>
          <span className="font-label-md text-label-md text-tertiary">{animal.especie}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">{animal.descripcion}</p>
        <PrecioAnimal animal={animal} />
        <p className={`font-label-md text-label-md ${sinCupos ? 'text-error' : 'text-secondary'}`}>
          {sinCupos ? 'Sin cupos disponibles' : `Quedan ${animal.cuposDisponibles} de ${animal.cuposTotales} cupos`}
        </p>
        <div className="flex justify-between font-label-md text-label-md">
          <span className="text-on-surface-variant">{animal.ubicacion}</span>
          <span className="text-primary">{animal.progreso}% financiado</span>
        </div>
        <BarraProgreso porcentaje={animal.progreso} />

        {sinCupos ? (
          <p className="text-center font-label-lg text-label-lg text-secondary py-2">¡Cupos completos! Gracias a todos.</p>
        ) : (
          <button onClick={onVer} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg py-2.5 rounded-full hover:bg-tertiary-container">
            Ver historia y apadrinar
          </button>
        )}
      </div>
    </article>
  )
}

export default TarjetaAnimal
