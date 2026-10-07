import { roles } from '../../data/usuarios'

// Una fila de la tabla de usuarios. esUnoMismo = es el admin que está logueado,
// que no puede cambiarse el rol ni darse de baja a sí mismo.
const FilaUsuario = ({ usuario, esUnoMismo, onCambiarRol, onCambiarActivo }) => {
  return (
    <tr className="border-t border-outline-variant">
      <td className="p-space-sm font-body-md text-body-md text-on-surface">
        {usuario.nombre} {usuario.apellido}
      </td>
      <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{usuario.nombreUsuario}</td>
      <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{usuario.mail}</td>
      <td className="p-space-sm">
        <select
          value={usuario.rol}
          disabled={esUnoMismo}
          onChange={(evento) => onCambiarRol(usuario.nombreUsuario, evento.target.value)}
          aria-label={`Rol de ${usuario.nombreUsuario}`}
          className="bg-surface-container-low rounded-lg px-space-sm py-1 font-label-lg text-label-lg text-on-surface disabled:opacity-50"
        >
          {roles.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </td>
      <td className="p-space-sm font-label-lg text-label-lg">
        {usuario.activo ? <span className="text-secondary">Activo</span> : <span className="text-error">Dado de baja</span>}
      </td>
      <td className="p-space-sm text-right">
        {esUnoMismo ? (
          <span className="font-body-sm text-body-sm text-on-surface-variant">Sos vos</span>
        ) : (
          <button onClick={() => onCambiarActivo(usuario.nombreUsuario)} className="font-label-lg text-label-lg text-primary hover:underline">
            {usuario.activo ? 'Dar de baja' : 'Reactivar'}
          </button>
        )}
      </td>
    </tr>
  )
}

export default FilaUsuario
