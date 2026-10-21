import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logo } from '../../data/imagenes'
import AccionesUsuario from './AccionesUsuario'
import MenuPrincipal from './MenuPrincipal'
import { useMoneda } from '../../hooks/useMoneda'
import { useMuelle } from '../../hooks/useMuelle'
import { useSesion } from '../../hooks/useSesion'

const Header = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { usuario, esAdmin, esRefugio, salir } = useSesion()
  const { items } = useMuelle()
  const { moneda, cambiarMoneda } = useMoneda()

  return (
    <header className="sticky top-0 z-50 w-full px-space-sm lg:px-margin py-space-sm print:hidden">
      <div className="max-w-7xl mx-auto py-space-sm px-space-md lg:px-space-lg flex flex-wrap items-center justify-between gap-space-sm bg-white/75 backdrop-blur-xl rounded-3xl shadow-lg ring-1 ring-white/60">
        <Link to="/" className="flex items-center gap-space-sm">
          <img src={logo} alt="Logo de SeaPlace" className="h-8" />
          <span className="font-title-lg text-title-lg text-primary">SeaPlace</span>
        </Link>

        <MenuPrincipal pathname={pathname} esAdmin={esAdmin} esRefugio={esRefugio} cantidadMuelle={items.length} />

        <AccionesUsuario
          usuario={usuario}
          esAdmin={esAdmin}
          pathname={pathname}
          moneda={moneda}
          onCambiarMoneda={cambiarMoneda}
          onIngresar={() => navigate('/panel')}
          onCuenta={() => navigate('/cuenta')}
          onSalir={salir}
        />
      </div>
    </header>
  )
}

export default Header