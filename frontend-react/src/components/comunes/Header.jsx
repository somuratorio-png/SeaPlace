import { logo } from '../../data/imagenes'
import BotonMenu from './BotonMenu'
import BotonMoneda from './BotonMoneda'
import Icono from './Icono'

const Header =({ rutaActual, cantidadMuelle, usuario, moneda, onCambiarMoneda, onNavegar, onSalir }) => {
  const esAdmin = usuario !== null && usuario.rol === 'administrador'
  const esRefugio = usuario !== null && usuario.rol === 'refugio'

  return (
    // Barra flotante: queda pegada arriba, separada de los bordes y con fondo de vidrio esmerilado
    <header className="sticky top-0 z-50 w-full px-space-sm lg:px-margin py-space-sm print:hidden">
      <div className="max-w-7xl mx-auto py-space-sm px-space-md lg:px-space-lg flex flex-wrap items-center justify-between gap-space-sm bg-white/75 backdrop-blur-xl rounded-3xl shadow-lg ring-1 ring-white/60">
        <button onClick={() => onNavegar('/')} className="flex items-center gap-space-sm">
          <img src={logo} alt="Logo de SeaPlace" className="h-8" />
          <span className="font-title-lg text-title-lg text-primary">SeaPlace</span>
        </button>

        <nav className="order-last w-full lg:order-none lg:w-auto flex flex-wrap items-center gap-space-sm">
          <BotonMenu texto="Inicio" activo={rutaActual === '/'} onClick={() => onNavegar('/')} />
          <BotonMenu texto="Fauna para Apadrinar" activo={rutaActual === '/catalogo'} onClick={() => onNavegar('/catalogo')} />
          {/* Admin y refugio no apadrinan, así que no ven el muelle */}
          {!esAdmin && !esRefugio && (
            <BotonMenu texto={`Muelle (${cantidadMuelle})`} activo={rutaActual === '/muelle'} onClick={() => onNavegar('/muelle')} />
          )}
          {esRefugio && (
            <BotonMenu texto="Mi refugio" activo={rutaActual === '/refugio'} onClick={() => onNavegar('/refugio')} />
          )}
          {esAdmin && (
            <BotonMenu texto="Administración" activo={rutaActual === '/admin'} onClick={() => onNavegar('/admin')} />
          )}
        </nav>

        <div className="flex flex-wrap items-center gap-space-md">
          <BotonMoneda moneda={moneda} onCambiar={onCambiarMoneda} />
          <button
            onClick={() => onNavegar('/panel')}
            className="flex items-center gap-1 bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full shadow-sm transition hover:bg-on-secondary-container"
          >
            <Icono nombre="person" clase="text-[18px]" />
            {usuario ? usuario.nombre : 'Ingresar'}
          </button>
          {usuario && (
            <button onClick={() => onNavegar('/cuenta')} className={`font-label-lg text-label-lg hover:text-primary ${rutaActual === '/cuenta' ? 'text-primary' : 'text-on-surface-variant'}`}>
              Mi cuenta
            </button>
          )}
          {usuario && (
            <button onClick={onSalir} className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
