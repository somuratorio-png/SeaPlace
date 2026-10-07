import { useContext } from 'react'
import { ContextoMoneda, formatearPrecio } from '../../contexto/Moneda'

// Muestra un precio (guardado en dólares) en la moneda que eligió el usuario.
// Uso: <Precio valor={animal.precio} />
const Precio = ({ valor }) => {
  const moneda = useContext(ContextoMoneda)
  return <>{formatearPrecio(valor, moneda)}</>
}

export default Precio
