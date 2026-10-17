import { useState } from 'react'
import CampoTexto from '../comunes/CampoTexto'
import TarjetaFormularioAdmin from './TarjetaFormularioAdmin'

// Formulario para crear un rol. onCrear le pide el rol al backend y devuelve una promesa
// con un mensaje de error, o null si salió bien (entonces el campo se vacía).
const FormularioRol = ({ onCrear }) => {
  const [nombre, setNombre] = useState('')

  const crear = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    onCrear(nombre.trim()).then((mensaje) => {
      if (mensaje === null) {
        setNombre('')
      }
    })
  }

  return (
    <TarjetaFormularioAdmin titulo="Nuevo rol" textoBoton="Crear rol" onEnviar={crear}>
      <CampoTexto etiqueta="Nombre del rol" nombre="nombreRol" valor={nombre} onCambiar={(evento) => setNombre(evento.target.value)} />
    </TarjetaFormularioAdmin>
  )
}

export default FormularioRol