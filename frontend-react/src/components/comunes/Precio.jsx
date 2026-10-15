import { formatearPrecio } from '../../contexto/Moneda'
import { useMoneda } from '../../hooks/useMoneda'

// Muestra un precio (guardado en dólares) en la moneda que eligió el usuario.
const Precio = ({ valor }) => {
  const { moneda } = useMoneda()
  return <>{formatearPrecio(valor, moneda)}</>
}

export default Precio