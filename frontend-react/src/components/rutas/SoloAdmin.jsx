import { Navigate } from 'react-router-dom'

// Deja pasar solo a un administrador: el resto va al panel (o al login)
const SoloAdmin = ({ usuario, children }) => {
  if (usuario !== null && usuario.rol === 'administrador') {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloAdmin