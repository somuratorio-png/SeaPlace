import { precioFinal, tieneDescuento } from '../../utils/precios'
import BarraProgreso from '../comunes/BarraProgreso'
import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'

// Un animal del refugio, con el botón para quitarlo del catálogo
const FilaAnimal = ({ animal, onVer, onQuitar }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex flex-wrap items-center gap-space-md transition hover:shadow-md">
      <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-20 h-20 object-cover rounded-xl" />

      <div className="flex-1 min-w-40 space-y-1">
        <h3 className="font-title-lg text-title-lg text-primary">{animal.nombre}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {animal.especie} · {animal.estado} · <Precio valor={precioFinal(animal)} />/mes
          {tieneDescuento(animal) && ` (en oferta, -${animal.descuento.porcentaje}%)`}
        </p>
        <BarraProgreso porcentaje={animal.progreso} />
        <p className="font-label-md text-label-md text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
      </div>

      <div className="flex items-center gap-space-sm">
        <button
          onClick={() => onVer(animal)}
          className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed-variant font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
        >
          <Icono nombre="visibility" clase="text-[18px]" /> Ver ficha
        </button>
        <button
          onClick={() => onQuitar(animal.id)}
          className="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
        >
          <Icono nombre="delete" clase="text-[18px]" /> Quitar
        </button>
      </div>
    </div>
  )
}

export default FilaAnimal
