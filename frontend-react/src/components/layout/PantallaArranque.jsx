import { useSesion } from '../../hooks/useSesion'
import Cargando from '../comunes/Cargando'
import SinConexion from '../comunes/SinConexion'

// Hasta que el backend contesta el pedido inicial, muestra el aviso de espera o el de error
const PantallaArranque = ({ children }) => {
  const { cargando, sinConexion, reintentar } = useSesion()

  if (cargando) {
    return <Cargando texto="Cargando SeaPlace…" />
  }
  if (sinConexion) {
    return <SinConexion mensaje={sinConexion} onReintentar={reintentar} />
  }
  return children
}

export default PantallaArranque