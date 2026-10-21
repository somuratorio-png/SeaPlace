import AccionUsuario from './AccionUsuario'
import CeldaUsuario from './CeldaUsuario'
import Chip from './Chip'
import SelectorRol from './SelectorRol'

const FilaUsuario = ({ usuario, roles, esUnoMismo, onCambiarRol, onCambiarActivo }) => {
  return (
    <tr className="border-t border-outline-variant hover:bg-surface-container-low">
      <td className="p-space-sm">
        <CeldaUsuario usuario={usuario} />
      </td>
      <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{usuario.mail}</td>
      <td className="p-space-sm">
        <SelectorRol usuario={usuario} roles={roles} deshabilitado={esUnoMismo} onCambiar={(rol) => onCambiarRol(usuario.nombreUsuario, rol)} />
      </td>
      <td className="p-space-sm">
        <Chip texto={usuario.activo ? 'Activo' : 'Dado de baja'} tono={usuario.activo ? 'verde' : 'rojo'} />
      </td>
      <td className="p-space-sm text-right">
        <AccionUsuario usuario={usuario} esUnoMismo={esUnoMismo} onCambiarActivo={onCambiarActivo} />
      </td>
    </tr>
  )
}

export default FilaUsuario