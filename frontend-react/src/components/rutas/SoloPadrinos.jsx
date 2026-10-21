import { Navigate } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'

const SoloPadrinos = ({ children }) => {
  const { esAdmin, esRefugio } = useSesion()

  if (esAdmin) {
    return <Navigate to="/admin" replace />
  }
  if (esRefugio) {
    return <Navigate to="/refugio" replace />
  }
  return children
}

export default SoloPadrinos