import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { ContextoMoneda } from './contexto/Moneda'
import { animalesDeDemo } from './data/animales'
import { usuariosDeDemo } from './data/usuarios'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Carrito from './views/Carrito'
import Catalogo from './views/Catalogo'
import Detalle from './views/Detalle'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Panel from './views/Panel'
import Refugio from './views/Refugio'

// App es el componente principal. Guarda el estado que comparten varias páginas
// y se lo pasa a cada una por props. La página que se muestra depende de la URL.
const App = () => {
  const [animales, setAnimales] = useState(animalesDeDemo)
  const [carrito, setCarrito] = useState([]) // [{ animal, plan }]
  const [apadrinados, setApadrinados] = useState([]) // lo que ya se confirmó
  const [usuarios, setUsuarios] = useState(usuariosDeDemo)
  const [usuario, setUsuario] = useState(null) // null = nadie logueado
  const [moneda, setMoneda] = useState('ARS') // 'ARS' | 'USD': en qué moneda se muestran los precios

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

  const agregarAnimal = (animal) => {
    setAnimales([...animales, animal])
  }

  const quitarAnimal = (idAnimal) => {
    setAnimales(animales.filter((animal) => animal.id !== idAnimal))
  }

  const esAdmin = usuario !== null && usuario.rol === 'administrador'
  const esRefugio = usuario !== null && usuario.rol === 'refugio'

  const salir = () => {
    setUsuario(null)
    irA('/')
  }

  // El panel es solo para usuarios logueados: si no hay nadie, se muestra el login
  const paginaPanel = usuario ? (
    <Panel usuario={usuario} apadrinados={apadrinados} onVerCatalogo={() => irA('/catalogo')} onVerApadrinado={verApadrinado} />
  ) : (
    <Login usuarios={usuarios} onIngresar={setUsuario} onRegistrar={registrar} />
  )

  return (
    // ContextoMoneda comparte la moneda elegida con todos los componentes que muestran precios
    <ContextoMoneda.Provider value={moneda}>
    <div className="min-h-screen fondo-playa font-body-md text-on-surface">
      <Header
        rutaActual={pathname}
        cantidadCarrito={carrito.length}
        usuario={usuario}
        moneda={moneda}
        onCambiarMoneda={setMoneda}
        onNavegar={irA}
        onSalir={salir}
      />

      <main>
        <Routes>
          <Route path="/" element={<Inicio animales={animales} onVerCatalogo={() => irA('/catalogo')} onVerAnimal={verAnimal} />} />
          <Route path="/catalogo" element={<Catalogo animales={animales} onVerAnimal={verAnimal} />} />
          <Route
            path="/animal/:id"
            element={<Detalle animales={animales} puedeApadrinar={!esAdmin} onAgregar={agregarAlCarrito} onVolver={() => irA('/catalogo')} />}
          />
          {/* Un administrador no apadrina: no tiene carrito ni panel de padrino, va directo a /admin */}
          <Route
            path="/carrito"
            element={
              esAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Carrito carrito={carrito} onQuitar={quitarDelCarrito} onConfirmar={confirmarCarrito} onVerCatalogo={() => irA('/catalogo')} />
              )
            }
          />
          <Route path="/panel" element={esAdmin ? <Navigate to="/admin" replace /> : paginaPanel} />
          <Route path="/panel/:id" element={<Apadrinado apadrinados={apadrinados} onVolver={() => irA('/panel')} />} />
          {/* Solo entra un administrador: el resto va al panel (o al login) */}
          <Route
            path="/admin"
            element={
              esAdmin ? (
                <Admin
                  usuario={usuario}
                  usuarios={usuarios}
                  animales={animales}
                  onCambiarRol={cambiarRol}
                  onCambiarActivo={cambiarActivo}
                  onVerAnimal={verAnimal}
                  onQuitarAnimal={quitarAnimal}
                />
              ) : (
                <Navigate to="/panel" replace />
              )
            }
          />
          {/* Solo entra un refugio: el resto va al panel (o al login) */}
          <Route
            path="/refugio"
            element={
              esRefugio ? (
                <Refugio usuario={usuario} animales={animales} onAgregar={agregarAnimal} onQuitar={quitarAnimal} onVerAnimal={verAnimal} />
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
    </ContextoMoneda.Provider>
  )
}

export default App
