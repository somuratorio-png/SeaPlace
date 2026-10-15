import { Navigate } from 'react-router-dom'
import { useSesion } from '../../hooks/useSesion'

const SoloRefugio = ({ children }) => {
  const { esRefugio } = useSesion()

  if (esRefugio) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloRefugio