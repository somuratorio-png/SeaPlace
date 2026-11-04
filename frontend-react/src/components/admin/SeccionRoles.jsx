import { useDispatch, useSelector } from 'react-redux'
import { asignarPermisos, crearPermiso, crearRol } from '../../Redux/rolesSlice'
import { intentar } from '../../utils/intentar'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioPermiso from './FormularioPermiso'
import FormularioRol from './FormularioRol'
import TarjetaRol from './TarjetaRol'

// Sección "Roles y permisos" del administrador: qué permisos tiene cada rol, y los formularios
// para crear un rol o un permiso nuevo. Un permiso es lo que el backend exige para ciertas rutas
// (por ejemplo GESTIONAR_USUARIOS); un rol es un conjunto de permisos.
// Los roles y los permisos los pide SeccionesAdmin y se leen del estado global.
// Cada acción llama al backend y, con lo que contesta, se actualiza el estado global. Si falla, onError muestra el mensaje.
const SeccionRoles = ({ onError }) => {
  const dispatch = useDispatch()
  const { items: roles, permisos, loading: cargando, error } = useSelector((state) => state.roles)

  // Reemplaza todos los permisos del rol por los elegidos.
  // Devuelve una promesa con el mensaje de error, o null si salió bien (lo usa la tarjeta del rol).
  const asignar = (idRol, idsPermisos) => intentar(dispatch(asignarPermisos({ idRol, idPermisos: idsPermisos })), onError)

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien (lo usa el formulario)
  const nuevoRol = (nombre) => intentar(dispatch(crearRol(nombre)), onError)

  const nuevoPermiso = (nombre, descripcion) => intentar(dispatch(crearPermiso({ nombrePermiso: nombre, descripcion })), onError)

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando los roles…" />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Roles y permisos</TituloSeccion>

      {roles.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Todavía no hay roles. Creá el primero con el formulario de abajo.</MensajeVacio>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
        {/* La key es el id del rol: cada tarjeta guarda los tildes que el usuario va eligiendo */}
        {roles.map((rol) => (
          <TarjetaRol key={rol.id} rol={rol} permisos={permisos} onAsignar={asignar} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
        <FormularioRol onCrear={nuevoRol} />
        <FormularioPermiso onCrear={nuevoPermiso} />
      </div>
    </section>
  )
}

export default SeccionRoles