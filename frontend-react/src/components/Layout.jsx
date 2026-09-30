import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

// Esqueleto común de todas las páginas con header y footer.
// En el medio (<Outlet />) React Router dibuja la página que corresponda a la URL.
export default function Layout() {
  const { pathname, hash } = useLocation()

  // En una SPA el navegador no vuelve arriba solo al cambiar de página, ni salta
  // a las #anclas. Lo hacemos a mano cada vez que cambia la URL.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="w-full pt-20 min-h-[calc(100vh-20rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
