import { createContext, useContext, useState } from 'react'
import * as authApi from '../api/auth'
import { clearToken, decodeToken, getToken, saveToken } from '../api/tokenStorage'

// Un "Context" es una forma de compartir datos con TODOS los componentes
// sin tener que pasarlos a mano de padre a hijo. Acá guardamos quién está logueado.
const AuthContext = createContext(null)

function usuarioDesdeToken(token) {
  const payload = token ? decodeToken(token) : null
  if (!payload) return null
  // exp viene en segundos; Date.now() en milisegundos
  if (payload.exp && payload.exp * 1000 < Date.now()) return null
  return { nombreUsuario: payload.sub }
}

export function AuthProvider({ children }) {
  // Al cargar la página, si había un token guardado y no venció, el usuario sigue logueado.
  const [usuario, setUsuario] = useState(() => {
    const u = usuarioDesdeToken(getToken())
    if (!u) clearToken()
    return u
  })

  function guardarSesion(token, recordar) {
    saveToken(token, recordar)
    setUsuario(usuarioDesdeToken(token))
  }

  async function login(nombreUsuario, contrasenia, recordar) {
    const { access_token } = await authApi.login(nombreUsuario, contrasenia)
    guardarSesion(access_token, recordar)
  }

  async function register(datos) {
    const { access_token } = await authApi.register(datos)
    guardarSesion(access_token, true)
  }

  function logout() {
    clearToken()
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
export function useAuth() {
  return useContext(AuthContext)
}
