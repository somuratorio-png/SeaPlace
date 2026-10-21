import { useState } from 'react'
import CampoTexto from '../comunes/CampoTexto'
import TarjetaFormularioAdmin from './TarjetaFormularioAdmin'
import { useFormulario } from '../../hooks/useFormulario'

const formularioVacio = { nombre: '', descripcion: '' }

const FormularioCategoria = ({ onCrear }) => {
  const { datos, cambiar, reiniciar } = useFormulario(formularioVacio)
  const [error, setError] = useState(null)

  const crear = (evento) => {
    evento.preventDefault()
    if (!datos.nombre.trim() || !datos.descripcion.trim()) {
      setError('Completá todos los campos')
      return
    }
    onCrear(datos.nombre.trim(), datos.descripcion.trim()).then((mensaje) => {
      setError(mensaje)
      if (mensaje === null) {
        reiniciar()
      }
    })
  }

  return (
    <TarjetaFormularioAdmin titulo="Nueva categoría" textoBoton="Crear categoría" error={error} onEnviar={crear}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
        <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
      </div>
    </TarjetaFormularioAdmin>
  )
}

export default FormularioCategoria