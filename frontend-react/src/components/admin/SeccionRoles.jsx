import { useState } from 'react'
import TituloSeccion from '../comunes/TituloSeccion'
import CampoTexto from '../login/CampoTexto'
import TarjetaRol from './TarjetaRol'

const claseFormulario = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container'

// Sección "Roles y permisos" del administrador: qué permisos tiene cada rol, y los formularios
// para crear un rol o un permiso nuevo. Un permiso es lo que el backend exige para ciertas rutas
// (por ejemplo GESTIONAR_USUARIOS); un rol es un conjunto de permisos.
// Las tres funciones devuelven el mensaje de error del backend, o null si salió bien.
const SeccionRoles = ({ roles, permisos, onCrearRol, onCrearPermiso, onAsignar }) => {
  const [nombreRol, setNombreRol] = useState('')
  const [permiso, setPermiso] = useState({ nombre: '', descripcion: '' })

  const crearRol = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if ((await onCrearRol(nombreRol)) === null) {
      setNombreRol('')
    }
  }

  const crearPermiso = async (evento) => {
    evento.preventDefault()
    if ((await onCrearPermiso(permiso.nombre, permiso.descripcion)) === null) {
      setPermiso({ nombre: '', descripcion: '' })
    }
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Roles y permisos</TituloSeccion>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
        {/* La "key" incluye los permisos: si cambian (o se crea uno), la tarjeta arranca de nuevo con los datos frescos */}
        {roles.map((rol) => (
          <TarjetaRol key={`${rol.id}-${rol.permisos.join()}-${permisos.length}`} rol={rol} permisos={permisos} onAsignar={onAsignar} />
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
