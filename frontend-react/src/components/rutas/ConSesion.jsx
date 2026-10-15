import { useSesion } from '../../hooks/useSesion'
import FormularioLogin from '../login/FormularioLogin'

// Si hay alguien logueado muestra la página; si no, muestra el login
const ConSesion = ({ children }) => {
  const { usuario } = useSesion()

  if (usuario !== null) {
    return children
  }
  return <FormularioLogin />
}

export default ConSesion