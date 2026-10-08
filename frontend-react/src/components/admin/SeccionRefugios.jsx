import { useState } from 'react'
import { paginar } from '../../utils/paginar'
import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaRefugio from './TarjetaRefugio'

const REFUGIOS_POR_PAGINA = 4

// Sección "Refugios" del administrador: los busca, los muestra de a una página y permite
// aprobarlos, darlos de baja y ver sus animales
const SeccionRefugios = ({ usuarios, animales, onCambiarActivo, onAprobar, onVerAnimal, onQuitarAnimal }) => {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  // Los que esperan aprobación van primero en la lista
  const refugios = [...pendientes, ...usuarios.filter((u) => u.rol === 'refugio' && u.aprobado)]

  const texto = busqueda.toLowerCase()
  const encontrados = refugios.filter((r) => `${r.nombre} ${r.apellido} ${r.mail}`.toLowerCase().includes(texto))
  const { items, paginaActual, totalPaginas } = paginar(encontrados, pagina, REFUGIOS_POR_PAGINA)

  // Al buscar se vuelve a la primera página
  const buscar = (valor) => {
    setBusqueda(valor)
    setPagina(0)
  }

  return (
    <section className="space-y-space-md">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <TituloSeccion>Refugios</TituloSeccion>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {items.length} de {encontrados.length} refugios
        </p>
      </div>

      {pendientes.length > 0 && (
        <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl px-space-lg py-space-md font-body-md text-body-md">
          Hay {pendientes.length} {pendientes.length === 1 ? 'refugio que espera' : 'refugios que esperan'} tu aprobación. Aparecen primero en la lista.
        </p>
      )}

      <Buscador valor={busqueda} onCambiar={buscar} textoAyuda="Buscar refugio por nombre o correo..." />

      {encontrados.length === 0 && (
        <p className="bg-surface-container rounded-2xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          Ningún refugio coincide con esa búsqueda.
        </p>
      )}
      {items.map((refugio) => (
        <TarjetaRefugio
          key={refugio.nombreUsuario}
          refugio={refugio}
          animales={animales.filter((animal) => animal.idRefugio === refugio.idRefugio)}
          onCambiarActivo={onCambiarActivo}
          onAprobar={onAprobar}
          onVerAnimal={onVerAnimal}
          onQuitarAnimal={onQuitarAnimal}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionRefugios
