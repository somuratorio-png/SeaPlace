import { Navigate } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'

const SoloAdmin = ({ children }) => {
  const { esAdmin } = useSesion()

  if (esAdmin) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloAdmin