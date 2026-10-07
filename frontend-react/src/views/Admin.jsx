import FilaUsuario from '../components/admin/FilaUsuario'

// Panel del administrador: lista todos los usuarios y permite cambiarles el rol o darlos de baja
const Admin = ({ usuario, usuarios, onCambiarRol, onCambiarActivo }) => {
  const activos = usuarios.filter((u) => u.activo)

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">Administración</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {usuarios.length} usuarios registrados · {activos.length} activos
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              <th className="p-space-sm">Nombre</th>
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
                key={u.nombreUsuario}
                usuario={u}
                esUnoMismo={u.nombreUsuario === usuario.nombreUsuario}
                onCambiarRol={onCambiarRol}
                onCambiarActivo={onCambiarActivo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admin
