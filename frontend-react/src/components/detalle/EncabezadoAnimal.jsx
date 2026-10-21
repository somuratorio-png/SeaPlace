import FavoritoAnimal from '../comunes/FavoritoAnimal'
import PrecioAnimal from '../comunes/PrecioAnimal'

const EncabezadoAnimal = ({ animal, onError }) => {
  return (
    <div className="flex items-start justify-between gap-space-md">
      <div>
        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
          {animal.especie} · {animal.edad} · {animal.ubicacion}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
        <PrecioAnimal animal={animal} />
      </div>
      <FavoritoAnimal animal={animal} onError={onError} />
    </div>
  )
}

export default EncabezadoAnimal