import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { traerCambiosPendientes, traerPublicaciones } from '../../Redux/animalesSlice'
import { traerApadrinamientos } from '../../Redux/apadrinamientosSlice'
import { traerCategorias } from '../../Redux/categoriasSlice'
import { traerMetricas } from '../../Redux/metricasSlice'
import { traerPermisos, traerRoles } from '../../Redux/rolesSlice'
import SeccionCategorias from './SeccionCategorias'
import SeccionMetricas from './SeccionMetricas'
import SeccionPublicaciones from './SeccionPublicaciones'
import SeccionRefugios from './SeccionRefugios'
import SeccionResumen from './SeccionResumen'
import SeccionRoles from './SeccionRoles'
import SeccionUsuarios from './SeccionUsuarios'
import MenuLateral from '../comunes/MenuLateral'

// Menú lateral del administrador y la sección elegida (una sola por vez): resumen, refugios, publicaciones
// por aprobar, usuarios, categorías o roles.
// Las listas se piden acá al montarse, una vez cada una, y cada sección las lee del estado global:
// así cambiar de sección no vuelve a pedirlas y el menú puede mostrar cuántas cosas esperan revisión.
// onCambiarActivo (dar de baja o reactivar) la usan dos secciones; onError muestra arriba de la página
// el mensaje de una acción que falló.
const SeccionesAdmin = ({ onCambiarActivo, onError }) => {
  const dispatch = useDispatch()
  const [seccion, setSeccion] = useState('resumen')
  const { items: usuarios } = useSelector((state) => state.usuarios)
  const { publicaciones, cambiosPendientes } = useSelector((state) => state.animales)

  // Las publicaciones son las de todos los refugios (activas, pausadas y pendientes): de ahí salen los animales
  // publicados, los de cada refugio y las publicaciones nuevas que esperan aprobación
  useEffect(() => {
    dispatch(traerPublicaciones())
    dispatch(traerCambiosPendientes())
    dispatch(traerApadrinamientos())
    dispatch(traerCategorias())
    dispatch(traerRoles())
    dispatch(traerPermisos())
    dispatch(traerMetricas())
  }, [dispatch])

  // Los refugios que esperan aprobación se avisan con un número en el menú, y lo mismo con lo que mandaron
  // a revisar (publicaciones nuevas y cambios en las ya aprobadas)
  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  const nuevas = publicaciones.filter((animal) => animal.publicacion === 'PENDIENTE')

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'metricas', nombre: 'Métricas comerciales', icono: 'monitoring' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'publicaciones', nombre: 'Publicaciones', icono: 'pending_actions', aviso: nuevas.length + cambiosPendientes.length },
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
        {seccion === 'resumen' && <SeccionResumen />}
        {seccion === 'metricas' && <SeccionMetricas />}
        {seccion === 'refugios' && <SeccionRefugios onCambiarActivo={onCambiarActivo} onError={onError} />}
        {seccion === 'publicaciones' && <SeccionPublicaciones onError={onError} />}
        {seccion === 'usuarios' && <SeccionUsuarios onCambiarActivo={onCambiarActivo} onError={onError} />}
        {seccion === 'categorias' && <SeccionCategorias />}
        {seccion === 'roles' && <SeccionRoles onError={onError} />}
      </div>
    </div>
  )
}

export default SeccionesAdmin
