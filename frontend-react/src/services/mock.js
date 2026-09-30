// Utilidades para simular un backend.
// Los servicios del front NO se conectan a ningún servidor: devuelven datos locales,
// pero de forma asíncrona (con Promises y una pequeña demora), igual que lo haría un fetch.
// Así las páginas ya están escritas "como si" hablaran con una API.

export const esperar = (ms = 400) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Lectura/escritura segura de localStorage (puede fallar en modo incógnito o si está bloqueado)
export const leerStorage = (key, valorPorDefecto) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

export const guardarStorage = (key, valor) => {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    // sin storage el mock sigue funcionando, solo no recuerda los cambios
  }
}
