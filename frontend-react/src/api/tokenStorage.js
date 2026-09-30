// Dónde se guarda el token JWT.
// Si el usuario tildó "Mantener mi sesión abierta" va a localStorage (sobrevive a cerrar
// el navegador); si no, a sessionStorage (se borra al cerrar la pestaña).

const KEY = 'seaplace_token'

export function getToken() {
  return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
}

export function saveToken(token, remember) {
  clearToken()
  ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
}

export function clearToken() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

// El JWT tiene 3 partes separadas por puntos; la del medio es JSON en base64.
// Spring guarda el nombre de usuario en "sub" y el vencimiento en "exp" (segundos).
export function decodeToken(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}
