import { useEffect, useState } from 'react'

// Igual que useState, pero además guarda el valor en el navegador (localStorage)
// para que no se pierda al recargar la página. "clave" es el nombre con el que se guarda.
// Es para preferencias de este navegador (como la moneda): los datos de la app viven en el backend.
export const useEstadoGuardado = (clave, valorInicial) => {
  const nombre = `seaplace-v3-${clave}`

  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(nombre)
      return guardado === null ? valorInicial : JSON.parse(guardado)
    } catch {
      return valorInicial
    }
  })

  // Cada vez que el valor cambia, se vuelve a guardar
  useEffect(() => {
    try {
      localStorage.setItem(nombre, JSON.stringify(valor))
    } catch {
      // Si el navegador se queda sin espacio, la app sigue andando igual (solo no se guarda)
    }
  }, [nombre, valor])

  return [valor, setValor]
}
