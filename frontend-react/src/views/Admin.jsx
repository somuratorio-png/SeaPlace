import { useState } from 'react'
import SeccionCategorias from '../components/admin/SeccionCategorias'
import SeccionRefugios from '../components/admin/SeccionRefugios'
import SeccionResumen from '../components/admin/SeccionResumen'
import SeccionRoles from '../components/admin/SeccionRoles'
import SeccionUsuarios from '../components/admin/SeccionUsuarios'
import MenuLateral from '../components/comunes/MenuLateral'
import Portada from '../components/comunes/Portada'

// Panel del administrador. Tiene un menú lateral y muestra una sola sección por vez
// (resumen, refugios, usuarios, categorías o roles). Los datos los pide App al backend cuando entra
// un administrador: todos los usuarios, los roles y permisos, todos los apadrinamientos y los animales
// (activos y pausados).
const Admin = ({
  usuario,
  usuarios,
  roles,
  permisos,
  categorias,
  animales,
  apadrinamientos,
  onCambiarRol,
  onCambiarActivo,
  onAprobar,
  onVerAnimal,
  onQuitarAnimal,
  onCrearCategoria,
  onCrearRol,
  onCrearPermiso,
  onAsignarPermisos,
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

  return (
    <>
      <Portada
        icono="admin_panel_settings"
        etiqueta="Panel de administración"
        titulo={`Hola, ${usuario.nombre}`}
        texto="Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-3">
          <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
        </div>

        <div className="lg:col-span-9">
          {seccion === 'resumen' && <SeccionResumen usuarios={usuarios} animales={animales} apadrinamientos={apadrinamientos} />}
          {seccion === 'refugios' && (
            <SeccionRefugios
              usuarios={usuarios}
              animales={animales}
              onCambiarActivo={onCambiarActivo}
              onAprobar={onAprobar}
              onVerAnimal={onVerAnimal}
              onQuitarAnimal={onQuitarAnimal}
            />
          )}
          {seccion === 'usuarios' && <SeccionUsuarios usuario={usuario} usuarios={usuarios} roles={roles} onCambiarRol={onCambiarRol} onCambiarActivo={onCambiarActivo} />}
          {seccion === 'categorias' && <SeccionCategorias categorias={categorias} animales={animales} onCrear={onCrearCategoria} />}
          {seccion === 'roles' && <SeccionRoles roles={roles} permisos={permisos} onCrearRol={onCrearRol} onCrearPermiso={onCrearPermiso} onAsignar={onAsignarPermisos} />}
        </div>
      </div>
    </>
  )
}

export default Admin
