export const ponerEn = (lista, elemento) =>
  lista.some((otro) => otro.id === elemento.id) ? lista.map((otro) => (otro.id === elemento.id ? elemento : otro)) : [...lista, elemento]

export const sacarDe = (lista, id) => lista.filter((elemento) => elemento.id !== id)
