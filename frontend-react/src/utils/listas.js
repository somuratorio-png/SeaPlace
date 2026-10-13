// Para cambiar una lista del estado después de un POST, PUT o DELETE, sin volver a pedirla al backend.
// Las dos devuelven una lista nueva (el estado de React no se modifica en el lugar).

// Si ya había un elemento con ese id lo reemplaza; si no, lo agrega al final
export const ponerEn = (lista, elemento) =>
  lista.some((otro) => otro.id === elemento.id) ? lista.map((otro) => (otro.id === elemento.id ? elemento : otro)) : [...lista, elemento]

export const sacarDe = (lista, id) => lista.filter((elemento) => elemento.id !== id)
