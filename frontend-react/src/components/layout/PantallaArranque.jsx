import { useDispatch, useSelector } from 'react-redux'
import { traerPlanes } from '../../Redux/planesSlice'
import Cargando from '../comunes/Cargando'
import SinConexion from '../comunes/SinConexion'

// Hasta que el backend contesta el pedido inicial (los planes, que despacha Layout), muestra el aviso
// de espera o el de error. Al abrir la página nunca hay nadie logueado (el token se pierde al recargar),
// así que no hay sesión que recuperar.
const PantallaArranque = ({ children }) => {
  const dispatch = useDispatch()
  const { items: planes, loading, error } = useSelector((state) => state.planes)

  // Antes del primer pedido todavía no hay planes (y loading sigue en false): también es "cargando"
  if (loading || (planes.length === 0 && error === null)) {
    return <Cargando texto="Cargando SeaPlace…" />
  }
  if (error) {
    return <SinConexion mensaje={error} onReintentar={() => dispatch(traerPlanes())} />
  }
  return children
}

export default PantallaArranque
