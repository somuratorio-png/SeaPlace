import { useState } from 'react'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { usuariosDeDemo } from './data/usuarios'
import Carrito from './views/Carrito'
import Catalogo from './views/Catalogo'
import Detalle from './views/Detalle'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Panel from './views/Panel'

// App es el componente principal. Guarda el estado que comparten varias páginas
// y se lo pasa a cada una por props.
const App = () => {
  const [pagina, setPagina] = useState('inicio') // 'inicio' | 'catalogo' | 'detalle' | 'carrito' | 'panel'
  const [animalElegido, setAnimalElegido] = useState(null)
  const [carrito, setCarrito] = useState([]) // [{ animal, plan }]
  const [apadrinados, setApadrinados] = useState([]) // lo que ya se confirmó
  const [usuarios, setUsuarios] = useState(usuariosDeDemo)
  const [usuario, setUsuario] = useState(null) // null = nadie logueado

  const irA = (nuevaPagina) => {
    setPagina(nuevaPagina)
  }

  const verAnimal = (animal) => {
    setAnimalElegido(animal)
    irA('detalle')
  }

  // Si el animal ya estaba en el carrito, se reemplaza (por si cambió de plan)
  const agregarAlCarrito = (animal, plan) => {
    const sinEseAnimal = carrito.filter((item) => item.animal.id !== animal.id)
    setCarrito([...sinEseAnimal, { animal, plan }])
    irA('carrito')
  }

  const quitarDelCarrito = (idAnimal) => {
    setCarrito(carrito.filter((item) => item.animal.id !== idAnimal))
  }

  // Pasa todo el carrito a "apadrinados" (sin repetir animales) y lo vacía
  const confirmarCarrito = () => {
    const anteriores = apadrinados.filter((item) => !carrito.some((nuevo) => nuevo.animal.id === item.animal.id))
    setApadrinados([...anteriores, ...carrito])
    setCarrito([])
    irA('panel')
  }

  const registrar = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario])
    setUsuario(nuevoUsuario)
  }

  const salir = () => {
    setUsuario(null)
    irA('inicio')
  }

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      <Header paginaActual={pagina} cantidadCarrito={carrito.length} usuario={usuario} onNavegar={irA} onSalir={salir} />

      <main>
        {pagina === 'inicio' && <Inicio onVerCatalogo={() => irA('catalogo')} onVerAnimal={verAnimal} />}
        {pagina === 'catalogo' && <Catalogo onVerAnimal={verAnimal} />}
        {pagina === 'detalle' && (
          <Detalle animal={animalElegido} onAgregar={agregarAlCarrito} onVolver={() => irA('catalogo')} />
        )}
        {pagina === 'carrito' && (
          <Carrito carrito={carrito} onQuitar={quitarDelCarrito} onConfirmar={confirmarCarrito} onVerCatalogo={() => irA('catalogo')} />
        )}
        {/* El panel es solo para usuarios logueados: si no hay nadie, se muestra el login */}
        {pagina === 'panel' && usuario && (
          <Panel usuario={usuario} apadrinados={apadrinados} onVerCatalogo={() => irA('catalogo')} />
        )}
        {pagina === 'panel' && !usuario && <Login usuarios={usuarios} onIngresar={setUsuario} onRegistrar={registrar} />}
      </main>

      <Footer />
    </div>
  )
}

export default App
