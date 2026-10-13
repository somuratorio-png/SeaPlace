import { useEffect, useState } from 'react'
import SeccionCategorias from '../components/admin/SeccionCategorias'
import SeccionRefugios from '../components/admin/SeccionRefugios'
import SeccionResumen from '../components/admin/SeccionResumen'
import SeccionRoles from '../components/admin/SeccionRoles'
import SeccionUsuarios from '../components/admin/SeccionUsuarios'
import AvisoError from '../components/comunes/AvisoError'
import Cargando from '../components/comunes/Cargando'
import MenuLateral from '../components/comunes/MenuLateral'
import Portada from '../components/comunes/Portada'
import * as animalesApi from '../services/animales'
import * as apadrinarApi from '../services/apadrinar'
import * as usuariosApi from '../services/usuarios'
import { intentar } from '../utils/intentar'
import { ponerEn } from '../utils/listas'

// Panel del administrador. Tiene un menú lateral y muestra una sola sección por vez
// (resumen, refugios, usuarios, categorías o roles).
// Lo que solo se ve acá lo pide esta página al montarse: los usuarios, los roles, los permisos y todos
// los apadrinamientos. Las categorías y los animales (activos y pausados) son los que ya tiene App.
// Cada acción llama al backend y, con lo que contesta, actualiza el estado: la lista no se vuelve a pedir.
// Si una acción falla, onError muestra el mensaje arriba de la página.
const Admin = ({ usuario, categorias, animales, onVerAnimal, onAnimalQuitado, onRefugioDeBaja, onCategoriaCreada, onError }) => {
  const [seccion, setSeccion] = useState('resumen')
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([]) // [{ id, nombre, permisos }]
  const [permisos, setPermisos] = useState([]) // [{ id, nombre, descripcion }]
  const [apadrinamientos, setApadrinamientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorAlCargar, setErrorAlCargar] = useState(null)

  // Un solo pedido de cada lista, al entrar al panel
  useEffect(() => {
    Promise.all([usuariosApi.traerUsuarios(), usuariosApi.traerRoles(), usuariosApi.traerPermisos(), apadrinarApi.traerApadrinamientos()])
      .then(([listaUsuarios, listaRoles, listaPermisos, listaApadrinamientos]) => {
        setUsuarios(listaUsuarios)
        setRoles(listaRoles)
        setPermisos(listaPermisos)
        setApadrinamientos(listaApadrinamientos)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
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

  const usuarioLlamado = (nombreUsuario) => usuarios.find((u) => u.nombreUsuario === nombreUsuario)

  // Pone en la lista al usuario como lo devolvió el backend
  const guardarUsuario = (cambiado) => {
    setUsuarios((actuales) => ponerEn(actuales, cambiado))
  }

  // ---------- Usuarios y refugios ----------

  // Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado
  const cambiarRol = (nombreUsuario, rol) => {
    const idRol = roles.find((r) => r.nombre === rol).id
    onError(null)
    usuariosApi
      .cambiarRol(usuarioLlamado(nombreUsuario).id, idRol)
      .then(guardarUsuario)
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
        guardarUsuario(cambiado)
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
        guardarUsuario({ ...elegido, aprobado: true })
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

  const crearRol = (nombre) =>
    intentar(
      usuariosApi.crearRol(nombre).then((rol) => {
        setRoles((actuales) => [...actuales, rol])
      }),
      onError,
    )

  const crearPermiso = (nombre, descripcion) =>
    intentar(
      usuariosApi.crearPermiso(nombre, descripcion).then((permiso) => {
        setPermisos((actuales) => [...actuales, permiso])
      }),
      onError,
    )

  // Reemplaza todos los permisos del rol por los elegidos
  const asignarPermisos = (idRol, idsPermisos) =>
    intentar(
      usuariosApi.asignarPermisos(idRol, idsPermisos).then((rol) => {
        setRoles((actuales) => ponerEn(actuales, rol))
      }),
      onError,
    )

  const elegirContenido = () => {
    if (cargando) {
      return <Cargando texto="Cargando el panel…" />
    }
    if (errorAlCargar) {
      return <AvisoError mensaje={errorAlCargar} />
    }
    return (
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

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">{elegirContenido()}</div>
    </>
  )
}

export default Admin
