import { colorDelRol } from '../../utils/roles'

const CeldaUsuario = ({ usuario }) => {
  return (
    <div className="flex items-center gap-space-sm">
      <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-label-lg text-label-lg ${colorDelRol(usuario.rol)}`}>
        {usuario.nombre.charAt(0).toUpperCase()}
      </span>
      <div>
        <div className="font-body-md text-body-md text-on-surface">
          {usuario.nombre} {usuario.apellido}
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant">@{usuario.nombreUsuario}</div>
      </div>
    </div>
  )
}

export default CeldaUsuario