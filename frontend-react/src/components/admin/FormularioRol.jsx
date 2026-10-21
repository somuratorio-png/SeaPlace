import { useState } from 'react'
import CampoTexto from '../comunes/CampoTexto'
import TarjetaFormularioAdmin from './TarjetaFormularioAdmin'

const FormularioRol = ({ onCrear }) => {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState(null)

  const crear = (evento) => {
    evento.preventDefault()
    if (!nombre.trim()) {
      setError('Completá todos los campos')
      return
    }
    setError(null)
    onCrear(nombre.trim()).then((mensaje) => {
      if (mensaje === null) {
        setNombre('')
      }
    })
  }

  return (
    <TarjetaFormularioAdmin titulo="Nuevo rol" textoBoton="Crear rol" error={error} onEnviar={crear}>
      <CampoTexto etiqueta="Nombre del rol" nombre="nombreRol" valor={nombre} onCambiar={(evento) => setNombre(evento.target.value)} />
    </TarjetaFormularioAdmin>
  )
}

export default FormularioRol