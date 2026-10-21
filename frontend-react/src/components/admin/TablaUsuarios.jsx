import FilaUsuario from './FilaUsuario'

const TablaUsuarios = ({ usuarios, roles, nombreLogueado, onCambiarRol, onCambiarActivo }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-primary-fixed font-label-md text-label-md text-on-primary-fixed-variant uppercase tracking-wider">
            <th className="p-space-sm">Usuario</th>
            <th className="p-space-sm">Correo</th>
            <th className="p-space-sm">Rol</th>
            <th className="p-space-sm">Estado</th>
            <th className="p-space-sm" />
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <FilaUsuario
              key={u.id}
              usuario={u}
              roles={roles}
              esUnoMismo={u.nombreUsuario === nombreLogueado}
              onCambiarRol={onCambiarRol}
              onCambiarActivo={onCambiarActivo}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaUsuarios