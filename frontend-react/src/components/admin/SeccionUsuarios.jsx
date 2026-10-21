import { cambiarRol } from '../../services/usuarios'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import Buscador from '../comunes/Buscador'
import EstadoCarga from '../comunes/EstadoCarga'
import Paginacion from '../comunes/Paginacion'
import EncabezadoLista from './EncabezadoLista'
import { useSesion } from '../../hooks/useSesion'
import MensajeVacio from '../comunes/MensajeVacio'
import TablaUsuarios from './TablaUsuarios'

const USUARIOS_POR_PAGINA = 5
const textoDelUsuario = (u) => `${u.nombre} ${u.apellido} ${u.nombreUsuario} ${u.mail} ${u.rol}`

const SeccionUsuarios = ({ usuarios, roles, cargando, error, onCambiarActivo, onGuardarUsuario, onError }) => {
  const { usuario, token } = useSesion()
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(usuarios, textoDelUsuario, USUARIOS_POR_PAGINA)

  const elegirRol = (nombreUsuario, rol) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    const idRol = roles.find((r) => r.nombre === rol).id
    onError(null)
    cambiarRol(token, elegido.id, idRol)
      .then(onGuardarUsuario)
      .catch((falla) => {
        onError(falla.message)
      })
  }

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando los usuarios…" />
  }

  return (
    <section className="space-y-space-md">
      <EncabezadoLista titulo="Usuarios" nombre="usuarios" mostrando={items.length} total={encontrados.length} />
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
