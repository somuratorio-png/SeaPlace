import { useSesion } from '../../hooks/useSesion'
import FormularioLogin from '../login/FormularioLogin'

const ConSesion = ({ children }) => {
  const { usuario } = useSesion()

  if (usuario !== null) {
    return children
  }
  return <FormularioLogin />
}

export default ConSesion