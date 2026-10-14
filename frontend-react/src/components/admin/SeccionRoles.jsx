import { useEffect, useState } from 'react'
import * as usuariosApi from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { ponerEn } from '../../utils/listas'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import TituloSeccion from '../comunes/TituloSeccion'
import CampoTexto from '../login/CampoTexto'
import TarjetaRol from './TarjetaRol'

const claseFormulario = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container'

// Sección "Roles y permisos" del administrador: qué permisos tiene cada rol, y los formularios
// para crear un rol o un permiso nuevo. Un permiso es lo que el backend exige para ciertas rutas
// (por ejemplo GESTIONAR_USUARIOS); un rol es un conjunto de permisos.
// Los roles y los permisos los pide esta sección al backend cuando se abre, un pedido por lista.
// Cada acción llama al backend y, con lo que contesta, actualiza la lista. Si falla, onError muestra el mensaje.
const SeccionRoles = ({ onError }) => {
  const [roles, setRoles] = useState([]) // [{ id, nombre, permisos }]
  const [permisos, setPermisos] = useState([]) // [{ id, nombre, descripcion }]
  const [cargando, setCargando] = useState(true)
  const [errorAlCargar, setErrorAlCargar] = useState(null)
  const [nombreRol, setNombreRol] = useState('')
  const [permiso, setPermiso] = useState({ nombre: '', descripcion: '' })

  // Los roles
  useEffect(() => {
    usuariosApi.traerRoles()
      .then((lista) => {
        setRoles(lista)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  // Los permisos que se les pueden asignar
  useEffect(() => {
    usuariosApi.traerPermisos()
      .then((lista) => {
        setPermisos(lista)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
      })
  }, [])

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
        setPermiso({ nombre: '', descripcion: '' })
      }
    })
  }

  if (cargando) {
    return <Cargando texto="Cargando los roles…" />
  }
  if (errorAlCargar) {
    return <AvisoError mensaje={errorAlCargar} />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Roles y permisos</TituloSeccion>

      {roles.length === 0 && (
        <p className="bg-surface-container rounded-2xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          Todavía no hay roles. Creá el primero con el formulario de abajo.
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
        {/* La "key" incluye los permisos: si cambian (o se crea uno), la tarjeta arranca de nuevo con los datos frescos */}
        {roles.map((rol) => (
          <TarjetaRol key={`${rol.id}-${rol.permisos.join()}-${permisos.length}`} rol={rol} permisos={permisos} onAsignar={asignar} />
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
          <CampoTexto etiqueta="Nombre (por ejemplo GESTIONAR_PAGOS)" nombre="nombre" valor={permiso.nombre} onCambiar={(evento) => setPermiso({ ...permiso, nombre: evento.target.value })} />
          <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={permiso.descripcion} onCambiar={(evento) => setPermiso({ ...permiso, descripcion: evento.target.value })} />
          <button type="submit" className={claseBoton}>
            Crear permiso
          </button>
        </form>
      </div>
    </section>
  )
}

export default SeccionRoles
