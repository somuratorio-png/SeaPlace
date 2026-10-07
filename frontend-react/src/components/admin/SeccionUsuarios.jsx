import { useState } from 'react'
import { paginar } from '../../utils/paginar'
import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import FilaUsuario from './FilaUsuario'

const USUARIOS_POR_PAGINA = 5

// Sección "Usuarios" del administrador: tabla paginada para cambiarles el rol o darlos de baja.
// "usuario" es el administrador que está logueado.
const SeccionUsuarios = ({ usuario, usuarios, onCambiarRol, onCambiarActivo }) => {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  const texto = busqueda.toLowerCase()
  const encontrados = usuarios.filter((u) => `${u.nombre} ${u.apellido} ${u.nombreUsuario} ${u.mail} ${u.rol}`.toLowerCase().includes(texto))
  const { items, paginaActual, totalPaginas } = paginar(encontrados, pagina, USUARIOS_POR_PAGINA)

  // Al buscar se vuelve a la primera página
  const buscar = (valor) => {
    setBusqueda(valor)
    setPagina(0)
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
        <p className="bg-surface-container rounded-2xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          Ningún usuario coincide con esa búsqueda.
        </p>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary-fixed font-label-md text-label-md text-on-primary-fixed-variant uppercase tracking-wider">
                <th className="p-space-sm">Usuario</th>
                <th className="p-space-sm">Correo</th>
                <th className="p-space-sm">Rol</th>
                <th className="p-space-sm">Estado</th>
                <th className="p-space-sm" />
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <FilaUsuario
                  key={u.nombreUsuario}
                  usuario={u}
                  esUnoMismo={u.nombreUsuario === usuario.nombreUsuario}
                  onCambiarRol={onCambiarRol}
                  onCambiarActivo={onCambiarActivo}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionUsuarios
