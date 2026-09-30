import { createContext, useContext, useEffect, useState } from 'react'

// Reemplaza a frontend/comun/cart.js.
// Antes: funciones globales (window.SeaPlaceCart) + document.querySelectorAll para
// actualizar el badge a mano. Ahora: un estado de React; cuando cambia, cada componente
// que lo usa (el badge del header, la página del carrito) se vuelve a dibujar solo.
const MuelleContext = createContext(null)

// Misma clave que usaba cart.js, así no se pierde lo que ya estaba guardado
const STORAGE_KEY = 'seaplace_sponsorship'

function leerGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function MuelleProvider({ children }) {
  // item = { animalId, name, species, price, plan, image } o null si está vacío
  const [item, setItem] = useState(leerGuardado)

  // Cada vez que cambia item, lo persistimos en localStorage
  useEffect(() => {
    try {
      if (item) localStorage.setItem(STORAGE_KEY, JSON.stringify(item))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // modo incógnito / storage bloqueado: el carrito funciona igual, solo no persiste
    }
  }, [item])

  const value = {
    item,
    count: item ? 1 : 0,
    setSponsorship: setItem,
    clearSponsorship: () => setItem(null),
  }

  return <MuelleContext.Provider value={value}>{children}</MuelleContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- el hook vive junto a su Provider a propósito
export function useMuelle() {
  return useContext(MuelleContext)
}
