import { cambiarRol, traerRoles } from '../../services/usuarios'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import Buscador from '../comunes/Buscador'
import EstadoCarga from '../comunes/EstadoCarga'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import { useConsulta } from '../../hooks/useConsulta'
import { useSesion } from '../../hooks/useSesion'
import MensajeVacio from '../comunes/MensajeVacio'
import TablaUsuarios from './TablaUsuarios'

const USUARIOS_POR_PAGINA = 5
const textoDelUsuario = (u) => `${u.nombre} ${u.apellido} ${u.nombreUsuario} ${u.mail} ${u.rol}`

// Sección "Usuarios" del administrador: tabla paginada para cambiarles el rol o darlos de baja.
// "usuarios" los tiene el panel y el administrador logueado se lee con useSesion.
// Los roles que existen los pide esta sección al backend cuando se abre.
const SeccionUsuarios = ({ usuarios, onCambiarActivo, onGuardarUsuario, onError }) => {
  const { datos: roles, cargando, error: errorAlCargar } = useConsulta(traerRoles, undefined, [])
  const { usuario } = useSesion()
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(usuarios, textoDelUsuario, USUARIOS_POR_PAGINA)

  // Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado.
  // El cambio se ve con el usuario que devuelve el backend.
  const elegirRol = (nombreUsuario, rol) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    const idRol = roles.find((r) => r.nombre === rol).id
    onError(null)
    cambiarRol(elegido.id, idRol)
      .then(onGuardarUsuario)
      .catch((falla) => {
        onError(falla.message)
      })
  }

  if (cargando || errorAlCargar) {
    return <EstadoCarga cargando={cargando} error={errorAlCargar} texto="Cargando los usuarios…" />
  }

  return (
    <section className="space-y-space-md">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <TituloSeccion>Usuarios</TituloSeccion>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {items.length} de {encontrados.length} usuarios
        </p>
      </div>
      <Buscador valor={busqueda} onCambiar={buscar} textoAyuda="Buscar usuario por nombre, correo o rol..." />

      {encontrados.length === 0 ? (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Ningún usuario coincide con esa búsqueda.</MensajeVacio>
      ) : (
        <TablaUsuarios usuarios={items} roles={roles} nombreLogueado={usuario.nombreUsuario} onCambiarRol={elegirRol} onCambiarActivo={onCambiarActivo} />
      )}
      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionUsuarios
