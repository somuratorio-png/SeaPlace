import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve páginas que requieren estar logueado.
// Si no hay sesión, redirige a /login y recuerda a dónde quería ir el usuario.
const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth()
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }
  return children
}

export default RutaProtegida
