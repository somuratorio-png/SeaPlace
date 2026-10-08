import Chip from './Chip'

// Color del círculo con la inicial, según el rol
const coloresPorRol = {
  padrino: 'bg-primary-fixed text-on-primary-fixed-variant',
  refugio: 'bg-secondary-container text-on-secondary-fixed-variant',
  administrador: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

// Una fila de la tabla de usuarios. esUnoMismo = es el admin que está logueado,
// que no puede cambiarse el rol ni darse de baja a sí mismo.
// "roles" son los que existen en el backend: [{ id, nombre }]. Un administrador no se puede dar de baja.
const FilaUsuario = ({ usuario, roles, esUnoMismo, onCambiarRol, onCambiarActivo }) => {
  // Si en el backend hay un rol que el front no conoce, se muestra con el color de padrino
  const colorDelRol = coloresPorRol[usuario.rol] ?? coloresPorRol.padrino
  const esAdmin = usuario.rol === 'administrador'

  return (
    <tr className="border-t border-outline-variant hover:bg-surface-container-low">
      <td className="p-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-label-lg text-label-lg ${colorDelRol}`}>
            {usuario.nombre.charAt(0).toUpperCase()}
          </span>
          <div>
            <div className="font-body-md text-body-md text-on-surface">
              {usuario.nombre} {usuario.apellido}
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">@{usuario.nombreUsuario}</div>
          </div>
        </div>
      </td>
      <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{usuario.mail}</td>
      <td className="p-space-sm">
        <select
          value={usuario.rol}
          disabled={esUnoMismo}
          onChange={(evento) => onCambiarRol(usuario.nombreUsuario, evento.target.value)}
          aria-label={`Rol de ${usuario.nombreUsuario}`}
          className={`rounded-lg px-space-sm py-1 font-label-lg text-label-lg disabled:opacity-60 ${colorDelRol}`}
        >
          {roles.map((rol) => (
            <option key={rol.id} value={rol.nombre}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </td>
      <td className="p-space-sm">
        <Chip texto={usuario.activo ? 'Activo' : 'Dado de baja'} tono={usuario.activo ? 'verde' : 'rojo'} />
      </td>
      <td className="p-space-sm text-right">
        {esUnoMismo && <Chip texto="Sos vos" tono="coral" />}
        {!esUnoMismo && !esAdmin && (
          <button
            onClick={() => onCambiarActivo(usuario.nombreUsuario)}
            className={`font-label-lg text-label-lg px-space-md py-1 rounded-full ${
              usuario.activo ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'
            }`}
          >
            {usuario.activo ? 'Dar de baja' : 'Reactivar'}
          </button>
        )}
      </td>
    </tr>
  )
}

export default FilaUsuario
