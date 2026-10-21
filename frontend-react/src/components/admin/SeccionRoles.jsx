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

const SeccionRoles = ({ roles, setRoles, permisos, setPermisos, cargando, error, onError }) => {
  const { token } = useSesion()

  const guardarRol = (rol) => {
    setRoles((actuales) => ponerEn(actuales, rol))
  }

  const asignar = (idRol, idsPermisos) => intentar(usuariosApi.asignarPermisos(token, idRol, idsPermisos).then(guardarRol), onError)

  const crearRol = (nombre) => intentar(usuariosApi.crearRol(token, nombre).then(guardarRol), onError)

  const crearPermiso = (nombre, descripcion) =>
    intentar(
      usuariosApi.crearPermiso(token, nombre, descripcion).then((nuevo) => {
        setPermisos((actuales) => [...actuales, nuevo])
      }),
      onError,
    )

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