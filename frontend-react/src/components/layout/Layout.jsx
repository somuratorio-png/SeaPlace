import { useLocation } from 'react-router-dom'
import Footer from '../comunes/Footer'
import Header from '../comunes/Header'
import PantallaArranque from './PantallaArranque'

const Layout = ({ children }) => {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col fondo-playa font-body-md text-on-surface">
      <Header />
      {/* La key vuelve a montar <main> al cambiar la ruta: React enfoca el botón invisible y la pantalla sube */}
      <main key={pathname} className="flex-1">
        <button tabIndex={-1} autoFocus aria-hidden="true" className="ancla-arriba" />
        <PantallaArranque>{children}</PantallaArranque>
      </main>
      <Footer />
    </div>
  )
}

export default Layout