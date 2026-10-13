import { useState } from 'react'
import SeccionCategorias from '../components/admin/SeccionCategorias'
import SeccionRefugios from '../components/admin/SeccionRefugios'
import SeccionResumen from '../components/admin/SeccionResumen'
import SeccionRoles from '../components/admin/SeccionRoles'
import SeccionUsuarios from '../components/admin/SeccionUsuarios'
import MenuLateral from '../components/comunes/MenuLateral'
import Portada from '../components/comunes/Portada'
import * as animalesApi from '../services/animales'
import * as usuariosApi from '../services/usuarios'
import { intentar } from '../utils/intentar'

// Panel del administrador. Tiene un menú lateral y muestra una sola sección por vez
// (resumen, refugios, usuarios, categorías o roles).
// Todo lo que muestra es lo que ya tiene App y le llega por props: los usuarios, los roles, los permisos,
// todos los apadrinamientos, las categorías y los animales (activos y pausados).
// Cada acción llama al backend y le pasa a App lo que contestó (onGuardarUsuario, onGuardarRol,
// onGuardarPermiso...): la lista no se vuelve a pedir.
// Si una acción falla, onError muestra el mensaje arriba de la página.
const Admin = ({
  usuario,
  usuarios,
  roles,
  permisos,
  apadrinamientos,
  categorias,
  animales,
  onVerAnimal,
  onGuardarUsuario,
  onGuardarRol,
  onGuardarPermiso,
  onAnimalQuitado,
  onRefugioDeBaja,
  onCategoriaCreada,
  onError,
}) => {
  const [seccion, setSeccion] = useState('resumen')

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'usuarios', nombre: 'Usuarios', icono: 'group' },
    { id: 'categorias', nombre: 'Categorías', icono: 'category' },
    { id: 'roles', nombre: 'Roles y permisos', icono: 'key' },
  ]

  const usuarioLlamado = (nombreUsuario) => usuarios.find((u) => u.nombreUsuario === nombreUsuario)

  // ---------- Usuarios y refugios ----------

  // Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado
  const cambiarRol = (nombreUsuario, rol) => {
    const idRol = roles.find((r) => r.nombre === rol).id
    onError(null)
    usuariosApi
      .cambiarRol(usuarioLlamado(nombreUsuario).id, idRol)
      .then(onGuardarUsuario)
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja.
  // Al dar de baja a un refugio sus publicaciones se pausan: se le avisa a App, que tiene los animales.
  const cambiarActivo = (nombreUsuario) => {
    const elegido = usuarioLlamado(nombreUsuario)
    const pedido = elegido.activo ? usuariosApi.darDeBaja(elegido.id) : usuariosApi.reactivar(elegido.id)
    onError(null)
    pedido
      .then((cambiado) => {
        onGuardarUsuario(cambiado)
        if (!cambiado.activo && cambiado.idRefugio) {
          onRefugioDeBaja(cambiado.idRefugio)
        }
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  const aprobarRefugio = (nombreUsuario) => {
    const elegido = usuarioLlamado(nombreUsuario)
    onError(null)
    usuariosApi
      .aprobarRefugio(elegido.idRefugio)
      .then(() => {
        onGuardarUsuario({ ...elegido, aprobado: true })
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitarAnimal = (idAnimal) => {
    onError(null)
    animalesApi
      .quitarAnimal(idAnimal)
      .then(() => {
        onAnimalQuitado(idAnimal)
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // ---------- Categorías, roles y permisos ----------
  // Todas devuelven una promesa con el mensaje de error, o null si salió bien (lo usan los formularios)

  // El error de esta lo muestra el propio formulario
  const crearCategoria = (nombre, descripcion) => intentar(animalesApi.crearCategoria(nombre, descripcion).then(onCategoriaCreada))

  const crearRol = (nombre) => intentar(usuariosApi.crearRol(nombre).then(onGuardarRol), onError)

  const crearPermiso = (nombre, descripcion) => intentar(usuariosApi.crearPermiso(nombre, descripcion).then(onGuardarPermiso), onError)

  // Reemplaza todos los permisos del rol por los elegidos
  const asignarPermisos = (idRol, idsPermisos) => intentar(usuariosApi.asignarPermisos(idRol, idsPermisos).then(onGuardarRol), onError)

  return (
    <>
      <Portada
        icono="admin_panel_settings"
        etiqueta="Panel de administración"
        titulo={`Hola, ${usuario.nombre}`}
        texto="Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-3">
            <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
          </div>

          <div className="lg:col-span-9">
            {seccion === 'resumen' && <SeccionResumen usuarios={usuarios} animales={animales} apadrinamientos={apadrinamientos} />}
            {seccion === 'refugios' && (
              <SeccionRefugios
                usuarios={usuarios}
                animales={animales}
                onCambiarActivo={cambiarActivo}
                onAprobar={aprobarRefugio}
                onVerAnimal={onVerAnimal}
                onQuitarAnimal={quitarAnimal}
              />
            )}
            {seccion === 'usuarios' && <SeccionUsuarios usuario={usuario} usuarios={usuarios} roles={roles} onCambiarRol={cambiarRol} onCambiarActivo={cambiarActivo} />}
            {seccion === 'categorias' && <SeccionCategorias categorias={categorias} animales={animales} onCrear={crearCategoria} />}
            {seccion === 'roles' && <SeccionRoles roles={roles} permisos={permisos} onCrearRol={crearRol} onCrearPermiso={crearPermiso} onAsignar={asignarPermisos} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin
