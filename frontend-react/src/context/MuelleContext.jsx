import { createContext, useContext, useEffect, useState } from 'react'

// Muelle = carrito de apadrinamiento (mismo nombre que en el backend).
// Reemplaza a frontend/comun/cart.js, que solo guardaba UN animal (cada "Apadrinar"
// pisaba al anterior). Ahora el muelle es una lista: se pueden apadrinar varios animales.
// Cuando cambia, cada componente que lo usa (el badge del header, la página del muelle)
// se vuelve a dibujar solo.
const MuelleContext = createContext(null)

const STORAGE_KEY = 'seaplace_muelle'
// Clave del formato viejo (un solo animal), para no perder lo que ya estaba guardado
const STORAGE_KEY_VIEJA = 'seaplace_sponsorship'

// Identifica a cada animal dentro del muelle (los items muy viejos no tenían animalId)
const claveDe = (item) => item.animalId ?? item.name

function leerGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
    const viejo = localStorage.getItem(STORAGE_KEY_VIEJA)
    return viejo ? [JSON.parse(viejo)] : []
  } catch {
    return []
  }
}

export function MuelleProvider({ children }) {
  // items = [{ animalId, name, species, price, frequency, plan, image, gift }, ...]
  const [items, setItems] = useState(leerGuardado)

  // Cada vez que cambia la lista, la persistimos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      localStorage.removeItem(STORAGE_KEY_VIEJA)
    } catch {
      // modo incógnito / storage bloqueado: el muelle funciona igual, solo no persiste
    }
  }, [items])

  // Si el animal ya estaba en el muelle, se actualiza (ej. cambió de plan); si no, se agrega al final
  function agregar(item) {
    setItems((actuales) => {
      const existe = actuales.some((i) => claveDe(i) === claveDe(item))
      return existe ? actuales.map((i) => (claveDe(i) === claveDe(item) ? item : i)) : [...actuales, item]
    })
  }

  function quitar(item) {
    setItems((actuales) => actuales.filter((i) => claveDe(i) !== claveDe(item)))
  }

  const value = {
    items,
    count: items.length,
    agregar,
    quitar,
    vaciar: () => setItems([]),
  }

  return <MuelleContext.Provider value={value}>{children}</MuelleContext.Provider>
}

// oxlint-disable-next-line react/only-export-components -- el hook vive junto a su Provider a propósito
export function useMuelle() {
  return useContext(MuelleContext)
}
