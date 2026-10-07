import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { usuariosDeDemo } from './data/usuarios'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Carrito from './views/Carrito'
import Catalogo from './views/Catalogo'
import Detalle from './views/Detalle'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Panel from './views/Panel'

// App es el componente principal. Guarda el estado que comparten varias páginas
// y se lo pasa a cada una por props. La página que se muestra depende de la URL.
const App = () => {
  const [carrito, setCarrito] = useState([]) // [{ animal, plan }]
  const [apadrinados, setApadrinados] = useState([]) // lo que ya se confirmó
  const [usuarios, setUsuarios] = useState(usuariosDeDemo)
  const [usuario, setUsuario] = useState(null) // null = nadie logueado

  const navigate = useNavigate()
  const { pathname } = useLocation() // la ruta actual, por ejemplo '/catalogo'

  const irA = (ruta) => {
    navigate(ruta)
  }

  const verAnimal = (animal) => {
    irA(`/animal/${animal.id}`)
  }

  const verApadrinado = (item) => {
    irA(`/panel/${item.animal.id}`)
  }

  // Si el animal ya estaba en el carrito, se reemplaza (por si cambió de plan)
  const agregarAlCarrito = (animal, plan) => {
    const sinEseAnimal = carrito.filter((item) => item.animal.id !== animal.id)
    setCarrito([...sinEseAnimal, { animal, plan }])
    irA('/carrito')
  }

  const quitarDelCarrito = (idAnimal) => {
    setCarrito(carrito.filter((item) => item.animal.id !== idAnimal))
  }

  // Pasa todo el carrito a "apadrinados" (sin repetir animales) y lo vacía
  const confirmarCarrito = () => {
    const anteriores = apadrinados.filter((item) => !carrito.some((nuevo) => nuevo.animal.id === item.animal.id))
    setApadrinados([...anteriores, ...carrito])
    setCarrito([])
    irA('/panel')
  }

  // Quien se registra arranca como padrino, igual que en el backend
  const registrar = (datos) => {
    const nuevoUsuario = { ...datos, rol: 'padrino', activo: true }
    setUsuarios([...usuarios, nuevoUsuario])
    setUsuario(nuevoUsuario)
  }

  const cambiarRol = (nombreUsuario, rol) => {
    setUsuarios(usuarios.map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, rol } : u)))
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja
  const cambiarActivo = (nombreUsuario) => {
    setUsuarios(usuarios.map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, activo: !u.activo } : u)))
  }

  const esAdmin = usuario !== null && usuario.rol === 'administrador'

  const salir = () => {
    setUsuario(null)
    irA('/')
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Header rutaActual={pathname} cantidadCarrito={carrito.length} usuario={usuario} onNavegar={irA} onSalir={salir} />

      <main>
        <Routes>
          <Route path="/" element={<Inicio onVerCatalogo={() => irA('/catalogo')} onVerAnimal={verAnimal} />} />
          <Route path="/catalogo" element={<Catalogo onVerAnimal={verAnimal} />} />
          <Route path="/animal/:id" element={<Detalle onAgregar={agregarAlCarrito} onVolver={() => irA('/catalogo')} />} />
          <Route
            path="/carrito"
            element={<Carrito carrito={carrito} onQuitar={quitarDelCarrito} onConfirmar={confirmarCarrito} onVerCatalogo={() => irA('/catalogo')} />}
          />
          {/* El panel es solo para usuarios logueados: si no hay nadie, se muestra el login */}
          <Route
            path="/panel"
            element={
              usuario ? (
                <Panel usuario={usuario} apadrinados={apadrinados} onVerCatalogo={() => irA('/catalogo')} onVerApadrinado={verApadrinado} />
              ) : (
                <Login usuarios={usuarios} onIngresar={setUsuario} onRegistrar={registrar} />
              )
            }
          />
          <Route path="/panel/:id" element={<Apadrinado apadrinados={apadrinados} onVolver={() => irA('/panel')} />} />
          {/* Solo entra un administrador: el resto va al panel (o al login) */}
          <Route
            path="/admin"
            element={
              esAdmin ? (
                <Admin usuario={usuario} usuarios={usuarios} onCambiarRol={cambiarRol} onCambiarActivo={cambiarActivo} />
              ) : (
                <Navigate to="/panel" replace />
              )
            }
          />
          {/* Cualquier otra dirección vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
