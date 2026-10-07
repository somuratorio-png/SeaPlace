import { useState } from 'react'
import FilaUsuario from '../components/admin/FilaUsuario'
import GraficoRecaudacion from '../components/admin/GraficoRecaudacion'
import TarjetaDato from '../components/admin/TarjetaDato'
import TarjetaRefugio from '../components/admin/TarjetaRefugio'
import Buscador from '../components/comunes/Buscador'
import Portada from '../components/comunes/Portada'
import TituloSeccion from '../components/comunes/TituloSeccion'
import { recaudacionMensual } from '../utils/precios'

// Panel del administrador: lista los refugios con sus animales, y todos los usuarios
// para cambiarles el rol o darlos de baja
const Admin = ({ usuario, usuarios, animales, apadrinamientos, onCambiarRol, onCambiarActivo, onAprobar, onVerAnimal, onQuitarAnimal }) => {
  const [busquedaRefugios, setBusquedaRefugios] = useState('')
  const [busquedaUsuarios, setBusquedaUsuarios] = useState('')

  const dadosDeBaja = usuarios.filter((u) => !u.activo)
  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  // Los que esperan aprobación van primero en la lista
  const refugios = [...pendientes, ...usuarios.filter((u) => u.rol === 'refugio' && u.aprobado)]

  // Un renglón del gráfico por cada refugio aprobado
  const recaudacionPorRefugio = refugios
    .filter((refugio) => refugio.aprobado)
    .map((refugio) => {
      const suyos = apadrinamientos.filter((a) => a.activo && a.animal.refugio === refugio.nombreUsuario)
      return { nombre: `${refugio.nombre} ${refugio.apellido}`, valor: recaudacionMensual(suyos), padrinos: suyos.length }
    })

  const textoRefugios = busquedaRefugios.toLowerCase()
  const refugiosVisibles = refugios.filter((r) => `${r.nombre} ${r.apellido} ${r.mail}`.toLowerCase().includes(textoRefugios))

  const textoUsuarios = busquedaUsuarios.toLowerCase()
  const usuariosVisibles = usuarios.filter((u) => `${u.nombre} ${u.apellido} ${u.nombreUsuario} ${u.mail} ${u.rol}`.toLowerCase().includes(textoUsuarios))

  return (
    <>
      <Portada
        icono="admin_panel_settings"
        etiqueta="Panel de administración"
        titulo={`Hola, ${usuario.nombre}`}
        texto="Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        <div className="escalonar grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          <TarjetaDato icono="home_health" valor={refugios.length} titulo="Refugios" clase="bg-secondary-container text-on-secondary-fixed-variant" />
          <TarjetaDato icono="pets" valor={animales.length} titulo="Animales publicados" clase="bg-primary-fixed text-on-primary-fixed-variant" />
          <TarjetaDato icono="group" valor={usuarios.length} titulo="Usuarios" clase="bg-tertiary-fixed text-on-tertiary-fixed-variant" />
          <TarjetaDato icono="person_off" valor={dadosDeBaja.length} titulo="Dados de baja" clase="bg-error-container text-on-error-container" />
        </div>

        {pendientes.length > 0 && (
          <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl px-space-lg py-space-md font-body-md text-body-md">
            Hay {pendientes.length} {pendientes.length === 1 ? 'refugio que espera' : 'refugios que esperan'} tu aprobación. Aparecen primero en la lista.
          </p>
        )}

        <GraficoRecaudacion datos={recaudacionPorRefugio} />

        <section className="space-y-space-md">
          <div className="flex flex-wrap items-end justify-between gap-space-sm">
            <TituloSeccion>Refugios</TituloSeccion>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando {refugiosVisibles.length} de {refugios.length} refugios
            </p>
          </div>
          <Buscador valor={busquedaRefugios} onCambiar={setBusquedaRefugios} textoAyuda="Buscar refugio por nombre o correo..." />

          {refugiosVisibles.length === 0 && (
            <p className="bg-surface-container rounded-2xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
              Ningún refugio coincide con esa búsqueda.
            </p>
          )}
          {refugiosVisibles.map((refugio) => (
            <TarjetaRefugio
              key={refugio.nombreUsuario}
              refugio={refugio}
              animales={animales.filter((animal) => animal.refugio === refugio.nombreUsuario)}
              onCambiarActivo={onCambiarActivo}
              onAprobar={onAprobar}
              onVerAnimal={onVerAnimal}
              onQuitarAnimal={onQuitarAnimal}
            />
          ))}
        </section>

        <section className="space-y-space-md">
          <div className="flex flex-wrap items-end justify-between gap-space-sm">
            <TituloSeccion>Usuarios</TituloSeccion>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando {usuariosVisibles.length} de {usuarios.length} usuarios
            </p>
          </div>
          <Buscador valor={busquedaUsuarios} onCambiar={setBusquedaUsuarios} textoAyuda="Buscar usuario por nombre, correo o rol..." />

          {usuariosVisibles.length === 0 ? (
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
                  {usuariosVisibles.map((u) => (
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
        </section>
      </div>
    </>
  )
}

export default Admin
