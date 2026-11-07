import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import FormularioLogin from '../login/FormularioLogin'
import { esPatrocinador } from '../../utils/roles'

// Si no hay nadie logueado muestra el login ahí mismo (como SoloAdmin y SoloRefugio).
// Si hay alguien que no es patrocinador, lo manda a su panel.
const SoloPatrocinador = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (usuario === null) {
    return <FormularioLogin />
  }
  if (esPatrocinador(usuario)) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloPatrocinador
