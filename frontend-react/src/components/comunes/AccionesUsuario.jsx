import BotonMoneda from './BotonMoneda'
import CampanaNotificaciones from './CampanaNotificaciones'
import Icono from './Icono'

// Lo de la derecha del header: la moneda, las notificaciones, el botón de ingresar (o el nombre del usuario),
// "Mi cuenta" y "Salir". "usuario" es null si no hay nadie logueado. Un administrador no recibe notificaciones,
// así que a él no se le muestra la campanita.
const AccionesUsuario = ({ usuario, esAdmin, pathname, moneda, onCambiarMoneda, onIngresar, onCuenta, onSalir }) => {
  return (
    <div className="flex flex-wrap items-center gap-space-md">
      <BotonMoneda moneda={moneda} onCambiar={onCambiarMoneda} />
      {usuario && !esAdmin && <CampanaNotificaciones />}
      <button
        onClick={onIngresar}
        className="flex items-center gap-1 bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full shadow-sm transition hover:bg-on-secondary-container"
      >
        <Icono nombre="person" clase="text-[18px]" />
        {usuario ? usuario.nombre : 'Ingresar'}
      </button>
      {usuario && (
        <button onClick={onCuenta} className={`font-label-lg text-label-lg hover:text-primary ${pathname === '/cuenta' ? 'text-primary' : 'text-on-surface-variant'}`}>
          Mi cuenta
        </button>
      )}
      {usuario && (
        <button onClick={onSalir} className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          Salir
        </button>
      )}
    </div>
  )
}

export default AccionesUsuario