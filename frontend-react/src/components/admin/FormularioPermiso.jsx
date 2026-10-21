import { useState } from 'react'
import CampoTexto from '../comunes/CampoTexto'
import TarjetaFormularioAdmin from './TarjetaFormularioAdmin'
import { useFormulario } from '../../hooks/useFormulario'

const formularioVacio = { nombre: '', descripcion: '' }

const FormularioPermiso = ({ onCrear }) => {
  const { datos, cambiar, reiniciar } = useFormulario(formularioVacio)
  const [error, setError] = useState(null)

  const crear = (evento) => {
    evento.preventDefault()
    if (!datos.nombre.trim() || !datos.descripcion.trim()) {
      setError('Completá todos los campos')
      return
    }
    setError(null)
    onCrear(datos.nombre.trim(), datos.descripcion.trim()).then((mensaje) => {
      if (mensaje === null) {
        reiniciar()
      }
    })
  }

  return (
    <TarjetaFormularioAdmin titulo="Nuevo permiso" textoBoton="Crear permiso" error={error} onEnviar={crear}>
      <CampoTexto etiqueta="Nombre (por ejemplo GESTIONAR_PAGOS)" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
      <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
    </TarjetaFormularioAdmin>
  )
}

export default FormularioPermiso