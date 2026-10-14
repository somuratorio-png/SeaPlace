import { Navigate } from 'react-router-dom'

// Deja pasar solo a un refugio: el resto va al panel (o al login)
const SoloRefugio = ({ usuario, children }) => {
  if (usuario !== null && usuario.rol === 'refugio') {
    return children
  }
  return <Navigate to="/panel" replace />
}

export default SoloRefugio