import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { esAdmin, esPatrocinador, esRefugio } from '../../utils/roles'

// Admin, refugio y patrocinador no apadrinan: van directo a su panel
const SoloPadrinos = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (esAdmin(usuario)) {
    return <Navigate to="/admin" replace />
  }
  if (esRefugio(usuario)) {
    return <Navigate to="/refugio" replace />
  }
  if (esPatrocinador(usuario)) {
    return <Navigate to="/patrocinador" replace />
  }
  return children
}

export default SoloPadrinos
