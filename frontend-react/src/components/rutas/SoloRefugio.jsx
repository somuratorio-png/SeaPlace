import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { esRefugio } from '../../utils/roles'

const SoloRefugio = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (esRefugio(usuario)) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloRefugio
