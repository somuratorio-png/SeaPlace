import { colorDelRol } from '../../utils/roles'

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