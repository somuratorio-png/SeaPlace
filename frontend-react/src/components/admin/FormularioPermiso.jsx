import CampoTexto from '../comunes/CampoTexto'
import TarjetaFormularioAdmin from './TarjetaFormularioAdmin'
import { useFormulario } from '../../hooks/useFormulario'

const formularioVacio = { nombre: '', descripcion: '' }

// Formulario para crear un permiso. onCrear le pide el permiso al backend y devuelve una promesa
// con un mensaje de error, o null si salió bien (entonces los campos se vacían).
const FormularioPermiso = ({ onCrear }) => {
  const { datos, cambiar, reiniciar } = useFormulario(formularioVacio)

  const crear = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    onCrear(datos.nombre.trim(), datos.descripcion.trim()).then((mensaje) => {
      if (mensaje === null) {
        reiniciar()
      }
    })
  }

  return (
    <TarjetaFormularioAdmin titulo="Nuevo permiso" textoBoton="Crear permiso" onEnviar={crear}>
      <CampoTexto etiqueta="Nombre (por ejemplo GESTIONAR_PAGOS)" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
      <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
    </TarjetaFormularioAdmin>
  )
}

export default FormularioPermiso