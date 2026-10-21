import { formatearPrecio } from '../../contexto/Moneda'
import { useMoneda } from '../../hooks/useMoneda'

const Precio = ({ valor }) => {
  const { moneda } = useMoneda()
  return <>{formatearPrecio(valor, moneda)}</>
}

export default Precio