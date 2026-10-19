import * as usuariosApi from '../../services/usuarios'
import { useSesion } from '../../hooks/useSesion'
import { intentar } from '../../utils/intentar'
import { ponerEn } from '../../utils/listas'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioPermiso from './FormularioPermiso'
import FormularioRol from './FormularioRol'
import TarjetaRol from './TarjetaRol'
import { useConsulta } from '../../hooks/useConsulta'

// Sección "Roles y permisos" del administrador: qué permisos tiene cada rol, y los formularios
// para crear un rol o un permiso nuevo. Un permiso es lo que el backend exige para ciertas rutas
// (por ejemplo GESTIONAR_USUARIOS); un rol es un conjunto de permisos.
// Los roles y los permisos los pide esta sección al backend cuando se abre, un pedido por lista.
// Cada acción llama al backend y, con lo que contesta, actualiza la lista. Si falla, onError muestra el mensaje.
const SeccionRoles = ({ onError }) => {
  const { token } = useSesion()
  const { datos: roles, setDatos: setRoles, cargando, error: errorRoles } = useConsulta(usuariosApi.traerRoles, undefined, [])
  const { datos: permisos, setDatos: setPermisos, error: errorPermisos } = useConsulta(usuariosApi.traerPermisos, undefined, [])
  const errorAlCargar = errorRoles ?? errorPermisos

  // Pone en la lista el rol como lo devolvió el backend (uno nuevo, o uno con sus permisos cambiados)
  const guardarRol = (rol) => {
    setRoles((actuales) => ponerEn(actuales, rol))
  }

  // Reemplaza todos los permisos del rol por los elegidos.
  // Devuelve una promesa con el mensaje de error, o null si salió bien (lo usa la tarjeta del rol).
  const asignar = (idRol, idsPermisos) => intentar(usuariosApi.asignarPermisos(token, idRol, idsPermisos).then(guardarRol), onError)

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien (lo usa el formulario)
  const crearRol = (nombre) => intentar(usuariosApi.crearRol(token, nombre).then(guardarRol), onError)

  const crearPermiso = (nombre, descripcion) =>
    intentar(
      usuariosApi.crearPermiso(token, nombre, descripcion).then((nuevo) => {
        setPermisos((actuales) => [...actuales, nuevo])
      }),
      onError,
    )

  if (cargando || errorAlCargar) {
    return <EstadoCarga cargando={cargando} error={errorAlCargar} texto="Cargando los roles…" />
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
        <FormularioRol onCrear={crearRol} />
        <FormularioPermiso onCrear={crearPermiso} />
      </div>
    </section>
  )
}

export default SeccionRoles