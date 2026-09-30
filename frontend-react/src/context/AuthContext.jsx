import { createContext, useContext, useState } from 'react'
import * as authService from '../services/authService'

// Un "Context" es una forma de compartir datos con TODOS los componentes
// sin tener que pasarlos a mano de padre a hijo. Acá guardamos quién está logueado.
const AuthContext = createContext(null)

// Si el usuario tildó "Mantener mi sesión abierta" la sesión va a localStorage
// (sobrevive a cerrar el navegador); si no, a sessionStorage (se borra al cerrar la pestaña).
const KEY = 'seaplace_sesion'

const leerSesion = () => {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const guardarSesion = (usuario, recordar) => {
  try {
    borrarSesion()
    ;(recordar ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(usuario))
  } catch {
    // sin storage, la sesión dura hasta recargar la página
  }
}

const borrarSesion = () => {
  try {
    localStorage.removeItem(KEY)
    sessionStorage.removeItem(KEY)
  } catch {
    // nada que borrar
  }
}

export const AuthProvider = ({ children }) => {
  // Al cargar la página, si había una sesión guardada, el usuario sigue logueado.
  const [usuario, setUsuario] = useState(leerSesion)

  const login = async (nombreUsuario, contrasenia, recordar) => {
    const u = await authService.login(nombreUsuario, contrasenia)
    guardarSesion(u, recordar)
    setUsuario(u)
  }

  const register = async (datos) => {
    const u = await authService.register(datos)
    guardarSesion(u, true)
    setUsuario(u)
  }

  const logout = () => {
    borrarSesion()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar la sesión desde cualquier componente: const { usuario } = useAuth()
// oxlint-disable-next-line react/only-export-components -- el hook vive junto a su Provider a propósito
export const useAuth = () => {
  return useContext(AuthContext)
}
