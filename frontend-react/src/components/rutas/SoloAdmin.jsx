import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { esAdmin } from '../../utils/roles'

const SoloAdmin = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (esAdmin(usuario)) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloAdmin
