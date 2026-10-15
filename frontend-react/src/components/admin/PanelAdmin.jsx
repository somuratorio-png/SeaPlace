import { useEffect, useState } from 'react'
import SeccionCategorias from './SeccionCategorias'
import SeccionRefugios from './SeccionRefugios'
import SeccionResumen from './SeccionResumen'
import SeccionRoles from './SeccionRoles'
import SeccionUsuarios from './SeccionUsuarios'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import MenuLateral from '../comunes/MenuLateral'
import Portada from '../comunes/Portada'
import * as usuariosApi from '../../services/usuarios'
import { ponerEn } from '../../utils/listas'

// Panel del administrador. Tiene un menú lateral y muestra una sola sección por vez
// (resumen, refugios, usuarios, categorías o roles).
// Esta página pide al montarse los usuarios, que usan el menú (el aviso de refugios pendientes) y varias
// secciones. Lo demás lo pide cada sección cuando se abre: sus animales, sus roles, sus categorías...
// Cada acción llama al backend y, con lo que contesta, actualiza el estado: la lista no se vuelve a pedir.
// Si una acción falla, onError muestra el mensaje arriba de la página.
const PanelAdmin = ({ usuario }) => {
  const [seccion, setSeccion] = useState('resumen')
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // Un solo pedido de los usuarios, al entrar al panel
  useEffect(() => {
    usuariosApi
      .traerUsuarios()
      .then((lista) => {
        setUsuarios(lista)
      })
      .catch((falla) => {
        setError(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'usuarios', nombre: 'Usuarios', icono: 'group' },
    { id: 'categorias', nombre: 'Categorías', icono: 'category' },
    { id: 'roles', nombre: 'Roles y permisos', icono: 'key' },
  ]

  // Pone en la lista al usuario como lo devolvió el backend
  const guardarUsuario = (cambiado) => {
    setUsuarios((actuales) => ponerEn(actuales, cambiado))
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja. La usan dos secciones.
  // Devuelve una promesa con el usuario como quedó, o null si el pedido falló.
  const cambiarActivo = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    const pedido = elegido.activo ? usuariosApi.darDeBaja(elegido.id) : usuariosApi.reactivar(elegido.id)
    setErrorAccion(null)
    return pedido
      .then((cambiado) => {
        guardarUsuario(cambiado)
        return cambiado
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
        return null
      })
  }

  const elegirContenido = () => {
    if (cargando) {
      return <Cargando texto="Cargando el panel…" />
    }
    if (error) {
      return <AvisoError mensaje={error} />
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-3">
          <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
        </div>

        <div className="lg:col-span-9">
          {seccion === 'resumen' && <SeccionResumen usuarios={usuarios} />}
          {seccion === 'refugios' && (
            <SeccionRefugios usuarios={usuarios} onCambiarActivo={cambiarActivo} onGuardarUsuario={guardarUsuario} onError={setErrorAccion} />
          )}
          {seccion === 'usuarios' && (
            <SeccionUsuarios usuario={usuario} usuarios={usuarios} onCambiarActivo={cambiarActivo} onGuardarUsuario={guardarUsuario} onError={setErrorAccion} />
          )}
          {seccion === 'categorias' && <SeccionCategorias />}
          {seccion === 'roles' && <SeccionRoles onError={setErrorAccion} />}
        </div>
      </div>
    )
  }

  return (
    <>
      <Portada
        icono="admin_panel_settings"
        etiqueta="Panel de administración"
        titulo={`Hola, ${usuario.nombre}`}
        texto="Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
        {elegirContenido()}</div>
    </>
  )
}

export default PanelAdmin
