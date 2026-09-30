import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import Muelle from './pages/Muelle'
import Catalogo from './pages/Catalogo'
import Dashboard from './pages/Dashboard'
import DetalleAnimal from './pages/DetalleAnimal'
import Inicio from './pages/Inicio'
import Login from './pages/Login'

// Mapa de URLs -> páginas. Reemplaza a tener un archivo .html por página.
//
//   /                 Inicio           (antes pacifico/inicio.html)
//   /catalogo         Catálogo         (antes pacifico/catalogo.html)
//   /animales/:id     Detalle          (antes pacifico/detalle-nori.html, ahora sirve para cualquier animal)
//   /muelle           Muelle (carrito) (antes pacifico/carrito.html)
//   /panel            Panel protector  (antes comun/dashboard.html, ahora requiere login)
//   /login            Login/Registro   (antes comun/login.html)
const App = () => {
  return (
    <Routes>
      {/* Todas estas comparten header y footer (Layout) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/animales/:id" element={<DetalleAnimal />} />
        <Route path="/muelle" element={<Muelle />} />
        {/* La URL vieja del carrito sigue funcionando */}
        <Route path="/carrito" element={<Navigate to="/muelle" replace />} />
        <Route
          path="/panel"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* El login es de pantalla completa, sin header ni footer (como en el diseño original) */}
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

const NoEncontrada = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-space-xl px-margin-mobile">
      <h1 className="font-headline-lg text-headline-lg text-primary">Esta página se la llevó la marea</h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">La dirección no existe.</p>
      <Link
        to="/"
        className="inline-block mt-space-md bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default App
