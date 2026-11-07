import BotonMenu from './BotonMenu'

// Los links del menú. Admin, refugio y patrocinador no apadrinan, así que no ven el muelle; cada uno ve su propio panel.
// "Patrocinar" (la página para empresas) lo ve quien no inició sesión: con una sesión abierta el header ya
// está lleno, y a la página también se llega desde "Nos acompañan" en el inicio.
const MenuPrincipal = ({ pathname, logueado, esAdmin, esRefugio, esPatrocinador, cantidadMuelle }) => {
  const apadrina = !esAdmin && !esRefugio && !esPatrocinador

  return (
    <nav className="order-last w-full lg:order-none lg:w-auto flex flex-wrap items-center gap-space-sm">
      <BotonMenu texto="Inicio" ruta="/" activo={pathname === '/'} />
      <BotonMenu texto="Fauna para Apadrinar" ruta="/catalogo" activo={pathname === '/catalogo'} />
      {apadrina && <BotonMenu texto={`Muelle (${cantidadMuelle})`} ruta="/muelle" activo={pathname === '/muelle'} />}
      {!logueado && <BotonMenu texto="Patrocinar" ruta="/patrocinar" activo={pathname === '/patrocinar'} />}
      {esRefugio && <BotonMenu texto="Mi refugio" ruta="/refugio" activo={pathname === '/refugio'} />}
      {esPatrocinador && <BotonMenu texto="Mi patrocinio" ruta="/patrocinador" activo={pathname === '/patrocinador'} />}
      {esAdmin && <BotonMenu texto="Administración" ruta="/admin" activo={pathname === '/admin'} />}
    </nav>
  )
}

export default MenuPrincipal
