import { useState } from 'react'

// Los datos de un formulario con un solo manejador para todos los campos:
// "cambiar" usa el "name" del input para saber cuál campo cambió.
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