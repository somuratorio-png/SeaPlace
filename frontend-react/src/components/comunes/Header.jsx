import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logo } from '../../data/imagenes'
import AccionesUsuario from './AccionesUsuario'
import MenuPrincipal from './MenuPrincipal'
import { useMoneda } from '../../hooks/useMoneda'
import { salir } from '../../Redux/usuarioSlice'
import { esAdmin, esRefugio } from '../../utils/roles'

// El menú son <Link>; los botones de la derecha navegan con useNavigate
const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const { usuario } = useSelector((state) => state.usuario)
  const { items } = useSelector((state) => state.muelle)
  const { moneda, cambiarMoneda } = useMoneda()

  // Al salir se vacían los datos de quien estaba logueado (sus favoritos, su muelle...) y se vuelve al inicio
  const handleSalir = () => {
    dispatch(salir())
    navigate('/')
  }

  return (
    // Barra flotante: queda pegada arriba, separada de los bordes y con fondo de vidrio esmerilado
    <header className="sticky top-0 z-50 w-full px-space-sm lg:px-margin py-space-sm print:hidden">
      <div className="max-w-7xl mx-auto py-space-sm px-space-md lg:px-space-lg flex flex-wrap items-center justify-between gap-space-sm bg-white/75 backdrop-blur-xl rounded-3xl shadow-lg ring-1 ring-white/60">
        <Link to="/" className="flex items-center gap-space-sm">
          <img src={logo} alt="Logo de SeaPlace" className="h-8" />
          <span className="font-title-lg text-title-lg text-primary">SeaPlace</span>
        </Link>

        <MenuPrincipal pathname={pathname} esAdmin={esAdmin(usuario)} esRefugio={esRefugio(usuario)} cantidadMuelle={items.length} />

        <AccionesUsuario
          usuario={usuario}
          esAdmin={esAdmin(usuario)}
          pathname={pathname}
          moneda={moneda}
          onCambiarMoneda={cambiarMoneda}
          onIngresar={() => navigate('/panel')}
          onCuenta={() => navigate('/cuenta')}
          onSalir={handleSalir}
        />
      </div>
    </header>
  )
}

export default Header
