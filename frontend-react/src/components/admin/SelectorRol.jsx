import { colorDelRol } from '../../utils/roles'

// Desplegable para cambiarle el rol a un usuario. "roles" son los que existen en el backend: [{ id, nombre }].
// onCambiar recibe el nombre del rol elegido.
const SelectorRol = ({ usuario, roles, deshabilitado, onCambiar }) => {
  return (
    <select
      name="rol"
      value={usuario.rol}
      disabled={deshabilitado}
      onChange={(evento) => onCambiar(evento.target.value)}
      aria-label={`Rol de ${usuario.nombreUsuario}`}
      className={`rounded-lg px-space-sm py-1 font-label-lg text-label-lg disabled:opacity-60 ${colorDelRol(usuario.rol)}`}
    >
      {roles.map((rol) => (
        <option key={rol.id} value={rol.nombre}>
          {rol.nombre}
        </option>
      ))}
    </select>
  )
}

export default SelectorRol