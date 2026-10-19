import { useState } from 'react'
import { traerCambiosPendientes, traerCategorias, traerPublicaciones } from '../../services/animales'
import { traerPermisos, traerRoles } from '../../services/usuarios'
import { useConsulta } from '../../hooks/useConsulta'
import { useApadrinamientos } from '../../hooks/useApadrinamientos'
import SeccionCategorias from './SeccionCategorias'
import SeccionPublicaciones from './SeccionPublicaciones'
import SeccionRefugios from './SeccionRefugios'
import SeccionResumen from './SeccionResumen'
import SeccionRoles from './SeccionRoles'
import SeccionUsuarios from './SeccionUsuarios'
import MenuLateral from '../comunes/MenuLateral'

// Menú lateral del administrador y la sección elegida (una sola por vez): resumen, refugios, publicaciones
// por aprobar, usuarios, categorías o roles. "usuarios" los tiene el panel; lo que cambia datos sube por las funciones "on...".
// Las listas se piden acá, una vez cada una, y las reciben las secciones: así cambiar de sección no vuelve a pedirlas
// y una lista que usan dos secciones (los roles, las publicaciones) se pide una sola vez.
const SeccionesAdmin = ({ usuarios, onCambiarActivo, onGuardarUsuario, onError }) => {
  const [seccion, setSeccion] = useState('resumen')

  // Las publicaciones de todos los refugios (activas, pausadas y pendientes): de acá salen los animales publicados,
  // los de cada refugio y las publicaciones nuevas que esperan aprobación
  const publicaciones = useConsulta(traerPublicaciones, undefined, [])
  const cambios = useConsulta(traerCambiosPendientes, undefined, [])
  const apadrinamientos = useApadrinamientos()
  const categorias = useConsulta(traerCategorias, undefined, [])
  const roles = useConsulta(traerRoles, undefined, [])
  const permisos = useConsulta(traerPermisos, undefined, [])

  const publicados = publicaciones.datos.filter((animal) => animal.publicacion === 'ACTIVA')
  const nuevas = publicaciones.datos.filter((animal) => animal.publicacion === 'PENDIENTE')

  // Los refugios que esperan aprobación se avisan con un número en el menú, y lo mismo con lo que mandaron
  // a revisar (publicaciones nuevas y cambios en las ya aprobadas)
  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'publicaciones', nombre: 'Publicaciones', icono: 'pending_actions', aviso: nuevas.length + cambios.datos.length },
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
        {seccion === 'resumen' && (
          <SeccionResumen
            usuarios={usuarios}
            publicados={publicados}
            apadrinamientos={apadrinamientos.datos}
            cargando={publicaciones.cargando || apadrinamientos.cargando}
            error={publicaciones.error ?? apadrinamientos.error}
          />
        )}
        {seccion === 'refugios' && (
          <SeccionRefugios
            usuarios={usuarios}
            animales={publicaciones.datos}
            setAnimales={publicaciones.setDatos}
            cargando={publicaciones.cargando}
            error={publicaciones.error}
            onCambiarActivo={onCambiarActivo}
            onGuardarUsuario={onGuardarUsuario}
            onError={onError}
          />
        )}
        {seccion === 'publicaciones' && (
          <SeccionPublicaciones
            pendientes={nuevas}
            setPublicaciones={publicaciones.setDatos}
            cambios={cambios.datos}
            setCambios={cambios.setDatos}
            cargando={publicaciones.cargando || cambios.cargando}
            error={publicaciones.error ?? cambios.error}
            onError={onError}
          />
        )}
        {seccion === 'usuarios' && (
          <SeccionUsuarios
            usuarios={usuarios}
            roles={roles.datos}
            cargando={roles.cargando}
            error={roles.error}
            onCambiarActivo={onCambiarActivo}
            onGuardarUsuario={onGuardarUsuario}
            onError={onError}
          />
        )}
        {seccion === 'categorias' && (
          <SeccionCategorias
            categorias={categorias.datos}
            setCategorias={categorias.setDatos}
            publicados={publicados}
            cargando={categorias.cargando || publicaciones.cargando}
            error={categorias.error ?? publicaciones.error}
          />
        )}
        {seccion === 'roles' && (
          <SeccionRoles
            roles={roles.datos}
            setRoles={roles.setDatos}
            permisos={permisos.datos}
            setPermisos={permisos.setDatos}
            cargando={roles.cargando || permisos.cargando}
            error={roles.error ?? permisos.error}
            onError={onError}
          />
        )}
      </div>
    </div>
  )
}

export default SeccionesAdmin
