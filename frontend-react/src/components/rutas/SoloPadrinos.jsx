import { Navigate } from 'react-router-dom'

// Admin y refugio no apadrinan: van directo a su panel. Pasan los padrinos y quien todavía no entró.
const SoloPadrinos = ({ usuario, children }) => {
  if (usuario !== null && usuario.rol === 'administrador') {
    return <Navigate to="/admin" replace />
  }
  if (usuario !== null && usuario.rol === 'refugio') {
    return <Navigate to="/refugio" replace />
  }
  return children
}

export default SoloPadrinos