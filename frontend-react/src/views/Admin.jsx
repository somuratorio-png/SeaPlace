import { useState } from 'react'
import FilaUsuario from '../components/admin/FilaUsuario'
import TarjetaDato from '../components/admin/TarjetaDato'
import TarjetaRefugio from '../components/admin/TarjetaRefugio'
import Icono from '../components/comunes/Icono'

// Panel del administrador: lista los refugios con sus animales, y todos los usuarios
// para cambiarles el rol o darlos de baja
const Admin = ({ usuario, usuarios, animales, onCambiarRol, onCambiarActivo, onVerAnimal, onQuitarAnimal }) => {
  const [busqueda, setBusqueda] = useState('')

  const dadosDeBaja = usuarios.filter((u) => !u.activo)
  const refugios = usuarios.filter((u) => u.rol === 'refugio')

  const texto = busqueda.toLowerCase()
  const refugiosVisibles = refugios.filter((r) => `${r.nombre} ${r.apellido} ${r.mail}`.toLowerCase().includes(texto))

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-xl">
      <div className="bg-tertiary text-on-tertiary rounded-xl p-space-xl flex flex-wrap items-center gap-space-lg shadow-md">
        <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center">
          <Icono nombre="admin_panel_settings" clase="text-[32px]" />
        </div>
        <div>
          <span className="font-label-md text-label-md uppercase tracking-wider text-tertiary-fixed">Panel de administración</span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg">Hola, {usuario.nombre}</h1>
          <p className="font-body-md text-body-md text-tertiary-fixed">
            Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        <TarjetaDato icono="home_health" valor={refugios.length} titulo="Refugios" clase="bg-secondary-container text-on-secondary-fixed-variant" />
        <TarjetaDato icono="pets" valor={animales.length} titulo="Animales publicados" clase="bg-tertiary-fixed text-on-tertiary-fixed-variant" />
        <TarjetaDato icono="group" valor={usuarios.length} titulo="Usuarios" clase="bg-primary-fixed text-on-primary-fixed-variant" />
        <TarjetaDato icono="person_off" valor={dadosDeBaja.length} titulo="Dados de baja" clase="bg-error-container text-on-error-container" />
      </div>

      <section className="space-y-space-md">
        <div className="flex flex-wrap items-end justify-between gap-space-sm">
          <h2 className="font-headline-md text-headline-md text-primary">Refugios</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Mostrando {refugiosVisibles.length} de {refugios.length} refugios
          </p>
        </div>

        <label className="relative block">
          <Icono nombre="search" clase="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar refugio por nombre o correo..."
            className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-lg font-body-sm text-body-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
          />
        </label>

        {refugiosVisibles.length === 0 && (
          <p className="bg-surface-container rounded-xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
            Ningún refugio coincide con esa búsqueda.
          </p>
        )}
        {refugiosVisibles.map((refugio) => (
          <TarjetaRefugio
            key={refugio.nombreUsuario}
            refugio={refugio}
            animales={animales.filter((animal) => animal.refugio === refugio.nombreUsuario)}
            onCambiarActivo={onCambiarActivo}
            onVerAnimal={onVerAnimal}
            onQuitarAnimal={onQuitarAnimal}
          />
        ))}
      </section>

      <section className="space-y-space-md">
        <h2 className="font-headline-md text-headline-md text-primary">Usuarios</h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                <th className="p-space-sm">Usuario</th>
                <th className="p-space-sm">Correo</th>
                <th className="p-space-sm">Rol</th>
                <th className="p-space-sm">Estado</th>
                <th className="p-space-sm" />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
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
      </section>
    </div>
  )
}

export default Admin
