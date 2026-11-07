import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import FormularioLogin from '../login/FormularioLogin'
import { esAdmin } from '../../utils/roles'

// Si no hay nadie logueado muestra el login ahí mismo, como ConSesion: si redirigiera, al tocar "Salir"
// esta redirección le ganaría al navigate('/') del Header y el usuario terminaría en /panel.
// Si hay alguien que no es admin, lo manda a su panel.
const SoloAdmin = ({ children }) => {
  const { usuario } = useSelector((state) => state.usuario)

  if (usuario === null) {
    return <FormularioLogin />
  }
  if (esAdmin(usuario)) {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloAdmin
