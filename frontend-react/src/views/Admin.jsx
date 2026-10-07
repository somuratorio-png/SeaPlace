import { useState } from 'react'
import SeccionRefugios from '../components/admin/SeccionRefugios'
import SeccionResumen from '../components/admin/SeccionResumen'
import SeccionUsuarios from '../components/admin/SeccionUsuarios'
import MenuLateral from '../components/comunes/MenuLateral'
import Portada from '../components/comunes/Portada'

// Panel del administrador. Tiene un menú lateral y muestra una sola sección por vez
// (resumen, refugios o usuarios): cada una se ocupa de lo suyo, y cuando se conecte el
// backend cada una va a pedir solo sus datos, en vez de traer todo junto.
const Admin = ({ usuario, usuarios, animales, apadrinamientos, onCambiarRol, onCambiarActivo, onAprobar, onVerAnimal, onQuitarAnimal }) => {
  const [seccion, setSeccion] = useState('resumen')

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)

  const secciones = [
    { id: 'resumen', nombre: 'Resumen', icono: 'dashboard' },
    { id: 'refugios', nombre: 'Refugios', icono: 'home_health', aviso: pendientes.length },
    { id: 'usuarios', nombre: 'Usuarios', icono: 'group' },
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
          {seccion === 'usuarios' && <SeccionUsuarios usuario={usuario} usuarios={usuarios} onCambiarRol={onCambiarRol} onCambiarActivo={onCambiarActivo} />}
        </div>
      </div>
    </>
  )
}

export default Admin
