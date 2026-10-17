import BotonMenu from './BotonMenu'

// Los links del menú. Admin y refugio no apadrinan, así que no ven el muelle; cada uno ve su propio panel.
const MenuPrincipal = ({ pathname, esAdmin, esRefugio, cantidadMuelle }) => {
  return (
    <nav className="order-last w-full lg:order-none lg:w-auto flex flex-wrap items-center gap-space-sm">
      <BotonMenu texto="Inicio" ruta="/" activo={pathname === '/'} />
      <BotonMenu texto="Fauna para Apadrinar" ruta="/catalogo" activo={pathname === '/catalogo'} />
      {!esAdmin && !esRefugio && <BotonMenu texto={`Muelle (${cantidadMuelle})`} ruta="/muelle" activo={pathname === '/muelle'} />}
      {esRefugio && <BotonMenu texto="Mi refugio" ruta="/refugio" activo={pathname === '/refugio'} />}
      {esAdmin && <BotonMenu texto="Administración" ruta="/admin" activo={pathname === '/admin'} />}
    </nav>
  )
}

export default MenuPrincipal