import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { esAdmin, esRefugio } from '../../utils/roles'

// Admin y refugio no apadrinan: van directo a su panel
const SoloPadrinos = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (esAdmin(usuario)) {
    return <Navigate to="/admin" replace />
  }
  if (esRefugio(usuario)) {
    return <Navigate to="/refugio" replace />
  }
  return children
}

export default SoloPadrinos
