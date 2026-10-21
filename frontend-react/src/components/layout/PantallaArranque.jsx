import { useSesion } from '../../hooks/useSesion'
import Cargando from '../comunes/Cargando'
import SinConexion from '../comunes/SinConexion'

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