import { logo } from '../../data/imagenes'
import BotonMenu from './BotonMenu'
import Icono from './Icono'

const Header =({ rutaActual, cantidadCarrito, usuario, onNavegar, onSalir }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto min-h-20 py-space-sm px-margin-mobile lg:px-margin flex flex-wrap items-center justify-between gap-space-sm">
        <button onClick={() => onNavegar('/')} className="flex items-center gap-space-sm">
          <img src={logo} alt="Logo de SeaPlace" className="h-8" />
          <span className="font-title-lg text-title-lg text-primary">SeaPlace</span>
        </button>

        <nav className="order-last w-full lg:order-none lg:w-auto flex flex-wrap items-center gap-space-xs">
          <BotonMenu texto="Inicio" activo={rutaActual === '/'} onClick={() => onNavegar('/')} />
          <BotonMenu texto="Fauna para Apadrinar" activo={rutaActual === '/catalogo'} onClick={() => onNavegar('/catalogo')} />
          <BotonMenu texto={`Carrito (${cantidadCarrito})`} activo={rutaActual === '/carrito'} onClick={() => onNavegar('/carrito')} />
        </nav>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => onNavegar('/panel')}
            className="flex items-center gap-1 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg px-space-md py-space-sm rounded-lg"
          >
            <Icono nombre="person" clase="text-[18px]" />
            {usuario ? usuario.nombre : 'Ingresar'}
          </button>
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
