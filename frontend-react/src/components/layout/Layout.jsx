import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { traerPlanes } from '../../Redux/planesSlice'
import Footer from '../comunes/Footer'
import Header from '../comunes/Header'
import PantallaArranque from './PantallaArranque'

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  // Una sola vez al abrir la página: los planes (hacen falta en cualquier pantalla para armar los precios).
  // Va acá y no en PantallaArranque porque <main> se vuelve a montar en cada cambio de ruta (ver la key).
  useEffect(() => {
    dispatch(traerPlanes())
  }, [dispatch])

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
