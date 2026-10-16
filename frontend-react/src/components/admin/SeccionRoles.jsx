import { useState } from 'react'
import * as usuariosApi from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { ponerEn } from '../../utils/listas'
import EstadoCarga from '../comunes/EstadoCarga'
import TituloSeccion from '../comunes/TituloSeccion'
import CampoTexto from '../comunes/CampoTexto'
import TarjetaRol from './TarjetaRol'
import { useConsulta } from '../../hooks/useConsulta'
import { useFormulario } from '../../hooks/useFormulario'

const claseFormulario = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container'

// Sección "Roles y permisos" del administrador: qué permisos tiene cada rol, y los formularios
// para crear un rol o un permiso nuevo. Un permiso es lo que el backend exige para ciertas rutas
// (por ejemplo GESTIONAR_USUARIOS); un rol es un conjunto de permisos.
// Los roles y los permisos los pide esta sección al backend cuando se abre, un pedido por lista.
// Cada acción llama al backend y, con lo que contesta, actualiza la lista. Si falla, onError muestra el mensaje.
const SeccionRoles = ({ onError }) => {
  const { datos: roles, setDatos: setRoles, cargando, error: errorRoles } = useConsulta(usuariosApi.traerRoles, undefined, [])
  const { datos: permisos, setDatos: setPermisos, error: errorPermisos } = useConsulta(usuariosApi.traerPermisos, undefined, [])
  const errorAlCargar = errorRoles ?? errorPermisos
  const [nombreRol, setNombreRol] = useState('')
  const { datos: permiso, cambiar: cambiarPermiso, reiniciar: reiniciarPermiso } = useFormulario({ nombre: '', descripcion: '' })

  // Pone en la lista el rol como lo devolvió el backend (uno nuevo, o uno con sus permisos cambiados)
  const guardarRol = (rol) => {
    setRoles((actuales) => ponerEn(actuales, rol))
  }

  // Reemplaza todos los permisos del rol por los elegidos.
  // Devuelve una promesa con el mensaje de error, o null si salió bien (lo usa la tarjeta del rol).
  const asignar = (idRol, idsPermisos) => intentar(usuariosApi.asignarPermisos(idRol, idsPermisos).then(guardarRol), onError)

  const crearRol = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    intentar(usuariosApi.crearRol(nombreRol.trim()).then(guardarRol), onError).then((mensaje) => {
      if (mensaje === null) {
        setNombreRol('')
      }
    })
  }

  const crearPermiso = (evento) => {
    evento.preventDefault()
    const pedido = usuariosApi.crearPermiso(permiso.nombre.trim(), permiso.descripcion.trim()).then((nuevo) => {
      setPermisos((actuales) => [...actuales, nuevo])
    })
    intentar(pedido, onError).then((mensaje) => {
      if (mensaje === null) {
        reiniciarPermiso()
      }
    })
  }

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
        <form onSubmit={crearRol} className={claseFormulario}>
          <h3 className="font-title-lg text-title-lg text-on-surface">Nuevo rol</h3>
          <CampoTexto etiqueta="Nombre del rol" nombre="nombreRol" valor={nombreRol} onCambiar={(evento) => setNombreRol(evento.target.value)} />
          <button type="submit" className={claseBoton}>
            Crear rol
          </button>
        </form>

        <form onSubmit={crearPermiso} className={claseFormulario}>
          <h3 className="font-title-lg text-title-lg text-on-surface">Nuevo permiso</h3>
          <CampoTexto etiqueta="Nombre (por ejemplo GESTIONAR_PAGOS)" nombre="nombre" valor={permiso.nombre} onCambiar={cambiarPermiso} />
          <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={permiso.descripcion} onCambiar={cambiarPermiso} />
          <button type="submit" className={claseBoton}>
            Crear permiso
          </button>
        </form>
      </div>
    </section>
  )
}

export default SeccionRoles
