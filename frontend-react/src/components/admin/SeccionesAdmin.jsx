import { useState } from 'react'
import { traerCambiosPendientes, traerPendientes } from '../../services/animales'
import { useConsulta } from '../../hooks/useConsulta'
import SeccionCategorias from './SeccionCategorias'
import SeccionPublicaciones from './SeccionPublicaciones'
import SeccionRefugios from './SeccionRefugios'
import SeccionResumen from './SeccionResumen'
import SeccionRoles from './SeccionRoles'
import SeccionUsuarios from './SeccionUsuarios'
import MenuLateral from '../comunes/MenuLateral'

// Menú lateral del administrador y la sección elegida (una sola por vez): resumen, refugios, publicaciones
// por aprobar, usuarios, categorías o roles. "usuarios" los tiene el panel; lo que cambia datos sube por las funciones "on...".
const SeccionesAdmin = ({ usuarios, onCambiarActivo, onGuardarUsuario, onError }) => {
  const [seccion, setSeccion] = useState('resumen')

  // Los refugios que esperan aprobación se avisan con un número en el menú
  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  // Lo mismo con lo que mandaron a revisar los refugios (publicaciones nuevas y cambios en las ya aprobadas):
  // se piden acá para poder contarlo en el menú
  const nuevas = useConsulta(traerPendientes, undefined, [])
  const cambios = useConsulta(traerCambiosPendientes, undefined, [])

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'publicaciones', nombre: 'Publicaciones', icono: 'pending_actions', aviso: nuevas.datos.length + cambios.datos.length },
    { id: 'usuarios', nombre: 'Usuarios', icono: 'group' },
    { id: 'categorias', nombre: 'Categorías', icono: 'category' },
    { id: 'roles', nombre: 'Roles y permisos', icono: 'key' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <div className="lg:col-span-3">
        <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
      </div>

      <div className="lg:col-span-9">
        {seccion === 'resumen' && <SeccionResumen usuarios={usuarios} />}
        {seccion === 'refugios' && <SeccionRefugios usuarios={usuarios} onCambiarActivo={onCambiarActivo} onGuardarUsuario={onGuardarUsuario} onError={onError} />}
        {seccion === 'publicaciones' && (
          <SeccionPublicaciones
            pendientes={nuevas.datos}
            setPendientes={nuevas.setDatos}
            cambios={cambios.datos}
            setCambios={cambios.setDatos}
            cargando={nuevas.cargando || cambios.cargando}
            error={nuevas.error ?? cambios.error}
            onError={onError}
          />
        )}
        {seccion === 'usuarios' && <SeccionUsuarios usuarios={usuarios} onCambiarActivo={onCambiarActivo} onGuardarUsuario={onGuardarUsuario} onError={onError} />}
        {seccion === 'categorias' && <SeccionCategorias />}
        {seccion === 'roles' && <SeccionRoles onError={onError} />}
      </div>
    </div>
  )
}

export default SeccionesAdmin