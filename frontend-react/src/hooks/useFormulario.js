import { useState } from 'react'

export const useFormulario = (valoresIniciales) => {
  const [datos, setDatos] = useState(valoresIniciales)

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos((actuales) => ({ ...actuales, [name]: value }))
  }

  const reiniciar = () => {
    setDatos(valoresIniciales)
  }

  return { datos, cambiar, reiniciar }
}