import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMuelle } from '../context/MuelleContext'
import { logo } from '../data/imagenes'
import Icon from './Icon'

const linkBase = 'px-space-md py-space-sm rounded-lg transition-all'
const linkInactivo = `${linkBase} font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high`
const linkActivo = `${linkBase} bg-primary-container text-on-primary font-title-lg`

// NavLink sabe solo si su ruta es la actual y nos pasa isActive.
// Antes cada HTML tenía el aria-current="page" puesto a mano en un link distinto.
const navClass = ({ isActive }) => {
  return isActive ? linkActivo : linkInactivo
}

const Header = () => {
  const { count } = useMuelle()
  const { usuario, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_12px_32px_-4px_rgba(140,106,82,0.06)]">
      <div className="w-full px-margin h-20 max-w-7xl mx-auto flex items-center justify-between gap-space-md">
        <Link to="/" className="flex items-center gap-space-md">
          <img alt="Logo Nariz de Foquita" className="h-8 w-auto object-contain" src={logo} />
          <div className="flex flex-col">
            <span className="font-title-lg text-title-lg text-primary leading-tight tracking-tight">SeaPlace</span>
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">Pacífico Guardián</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-space-xs">
          <NavLink to="/" end className={navClass}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={navClass}>
            Fauna para Apadrinar
          </NavLink>
          <Link to="/#kit-protector" className={linkInactivo}>
            Nuestra Misión
          </Link>
          <NavLink to="/muelle" className={(estado) => `${navClass(estado)} relative flex items-center gap-space-xs`}>
            <span>Carrito de Apadrinamiento</span>
            {/* El badge se actualiza solo cuando cambia el carrito: no hay que tocar el DOM a mano */}
            {count > 0 && (
              <span className="bg-secondary text-on-secondary font-label-md text-label-md px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </NavLink>
        </nav>

        <div className="flex items-center gap-space-md">
          <Link
            to={usuario ? '/panel' : '/login'}
            className="hidden sm:inline-flex items-center gap-space-xs bg-secondary-container text-on-secondary-container font-label-lg text-label-lg px-space-md py-space-sm rounded-lg hover:bg-secondary hover:text-on-secondary transition-all"
          >
            {usuario ? 'Área de Protector' : 'Iniciar sesión'}
          </Link>
          {usuario ? (
            <button
              type="button"
              onClick={logout}
              title={`Cerrar sesión de ${usuario.nombreUsuario}`}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-lg uppercase"
            >
              {usuario.nombreUsuario.charAt(0)}
            </button>
          ) : (
            <Link
              to="/login"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
              title="Iniciar sesión"
            >
              <Icon name="person" className="text-on-primary text-[18px]" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
