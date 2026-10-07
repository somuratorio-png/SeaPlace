import { precioFinal, tieneDescuento } from '../../utils/precios'
import Precio from './Precio'

// Cuota mensual de un animal. Si está en oferta, muestra el precio viejo tachado y el descuento.
const PrecioAnimal = ({ animal }) => {
  if (!tieneDescuento(animal)) {
    return (
      <span className="font-title-lg text-title-lg text-primary">
        <Precio valor={animal.precio} />
        /mes
      </span>
    )
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-space-xs">
      <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
        <Precio valor={animal.precio} />
      </span>
      <span className="font-title-lg text-title-lg text-tertiary">
        <Precio valor={precioFinal(animal)} />
        /mes
      </span>
      <span className="bg-tertiary text-on-tertiary rounded-full px-space-sm py-0.5 font-label-md text-label-md">
        -{animal.descuento.porcentaje}%
      </span>
    </span>
  )
}

export default PrecioAnimal
