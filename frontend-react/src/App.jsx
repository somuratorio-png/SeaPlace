import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { ContextoMoneda } from './contexto/Moneda'
import { animalesDeDemo } from './data/animales'
import { apadrinamientosDeDemo, novedadesDeDemo } from './data/apadrinamientos'
import { usuariosDeDemo } from './data/usuarios'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import { hoy } from './utils/fechas'
import { totalCarrito } from './utils/precios'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Carrito from './views/Carrito'
import Catalogo from './views/Catalogo'
import Certificado from './views/Certificado'
import Detalle from './views/Detalle'
import Gracias from './views/Gracias'
import Inicio from './views/Inicio'
import Login from './views/Login'
import NoEncontrada from './views/NoEncontrada'
import Pago from './views/Pago'
import Panel from './views/Panel'
import Refugio from './views/Refugio'

// App es el componente principal. Guarda el estado que comparten varias páginas
// y se lo pasa a cada una por props. La página que se muestra depende de la URL.
// Lo que usa useEstadoGuardado queda guardado en el navegador y sobrevive a un F5.
const App = () => {
  const [animales, setAnimales] = useEstadoGuardado('animales', animalesDeDemo)
  const [usuarios, setUsuarios] = useEstadoGuardado('usuarios', usuariosDeDemo)
  const [apadrinamientos, setApadrinamientos] = useEstadoGuardado('apadrinamientos', apadrinamientosDeDemo)
  const [novedades, setNovedades] = useEstadoGuardado('novedades', novedadesDeDemo)
  const [carrito, setCarrito] = useEstadoGuardado('carrito', []) // [{ animal, plan }]
  const [favoritos, setFavoritos] = useEstadoGuardado('favoritos', []) // ids de animales
  const [sesion, setSesion] = useEstadoGuardado('sesion', null) // nombre de usuario de quien entró, o null
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'
  const [conBotiquin, setConBotiquin] = useState(false)
  const [ultimaCompra, setUltimaCompra] = useState(null) // { cantidad, total } para la página de gracias

  const navigate = useNavigate()
  const { pathname } = useLocation() // la ruta actual, por ejemplo '/catalogo'

  // El usuario logueado se busca siempre en la lista, así se entera si le cambiaron el rol o lo dieron de baja
  const usuario = usuarios.find((u) => u.nombreUsuario === sesion && u.activo) ?? null
  const esAdmin = usuario !== null && usuario.rol === 'administrador'
  const esRefugio = usuario !== null && usuario.rol === 'refugio'
  // Solo apadrinan los padrinos (y quien todavía no entró). Admin y refugio tienen su propio panel.
  const puedeApadrinar = !esAdmin && !esRefugio
  const panelPropio = esAdmin ? '/admin' : '/refugio'

  // Los apadrinamientos activos de quien está logueado, con los datos más nuevos de cada animal
  const misApadrinados = apadrinamientos
    .filter((a) => usuario !== null && a.usuario === usuario.nombreUsuario && a.activo)
    .map((a) => ({ ...a, animal: animales.find((animal) => animal.id === a.animal.id) ?? a.animal }))

  const animalesFavoritos = animales.filter((animal) => favoritos.includes(animal.id))

  const irA = (ruta) => {
    navigate(ruta)
  }

  const verAnimal = (animal) => {
    irA(`/animal/${animal.id}`)
  }

  const verApadrinado = (item) => {
    irA(`/panel/${item.animal.id}`)
  }

  // ---------- Favoritos y carrito ----------

  const alternarFavorito = (idAnimal) => {
    if (favoritos.includes(idAnimal)) {
      setFavoritos(favoritos.filter((id) => id !== idAnimal))
    } else {
      setFavoritos([...favoritos, idAnimal])
    }
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

  // Se llama cuando el pago salió bien: cada item del carrito pasa a ser un apadrinamiento
  // del usuario (si ya apadrinaba a ese animal, se reemplaza) y el carrito se vacía
  const confirmarCarrito = () => {
    const nuevos = carrito.map((item) => ({
      id: crypto.randomUUID(),
      usuario: usuario.nombreUsuario,
      animal: item.animal,
      plan: item.plan,
      desde: hoy(),
      activo: true,
      pagos: [{ fecha: hoy(), monto: item.plan.precio }],
    }))
    const repetido = (a) => a.usuario === usuario.nombreUsuario && a.activo && carrito.some((item) => item.animal.id === a.animal.id)

    setApadrinamientos([...apadrinamientos.filter((a) => !repetido(a)), ...nuevos])
    setUltimaCompra({ cantidad: carrito.length, total: totalCarrito(carrito, conBotiquin) })
    setCarrito([])
    setConBotiquin(false)
    irA('/gracias')
  }

  // ---------- Apadrinamientos del padrino ----------

  const cambiarPlan = (idApadrinamiento, plan) => {
    setApadrinamientos(apadrinamientos.map((a) => (a.id === idApadrinamiento ? { ...a, plan } : a)))
  }

  // No se borra: queda inactivo, así el historial no se pierde
  const cancelarApadrinamiento = (idApadrinamiento) => {
    setApadrinamientos(apadrinamientos.map((a) => (a.id === idApadrinamiento ? { ...a, activo: false } : a)))
    irA('/panel')
  }

  // ---------- Usuarios ----------

  // Un padrino entra directo. Un refugio queda pendiente hasta que un administrador lo apruebe.
  const registrar = (datos, esUnRefugio) => {
    const nuevoUsuario = esUnRefugio
      ? { ...datos, rol: 'refugio', activo: true, aprobado: false }
      : { ...datos, rol: 'padrino', activo: true }
    setUsuarios([...usuarios, nuevoUsuario])
    setSesion(nuevoUsuario.nombreUsuario)
  }

  const cambiarRol = (nombreUsuario, rol) => {
    // Si el administrador convierte a alguien en refugio, ya queda aprobado
    setUsuarios(usuarios.map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, rol, aprobado: true } : u)))
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja
  const cambiarActivo = (nombreUsuario) => {
    setUsuarios(usuarios.map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, activo: !u.activo } : u)))
  }

  const aprobarRefugio = (nombreUsuario) => {
    setUsuarios(usuarios.map((u) => (u.nombreUsuario === nombreUsuario ? { ...u, aprobado: true } : u)))
  }

  const salir = () => {
    setSesion(null)
    irA('/')
  }

  // ---------- Animales (refugio y admin) ----------

  const agregarAnimal = (animal) => {
    setAnimales([...animales, animal])
  }

  const quitarAnimal = (idAnimal) => {
    setAnimales(animales.filter((animal) => animal.id !== idAnimal))
  }

  // "cambios" trae solo los campos a modificar, por ejemplo { descuento: {...} } o { fotos: [...] }
  const editarAnimal = (idAnimal, cambios) => {
    setAnimales(animales.map((animal) => (animal.id === idAnimal ? { ...animal, ...cambios } : animal)))
  }

  const publicarNovedad = (idAnimal, texto) => {
    setNovedades([{ id: crypto.randomUUID(), animalId: idAnimal, fecha: hoy(), texto }, ...novedades])
  }

  // ---------- Páginas que dependen de quién está logueado ----------

  const login = <Login usuarios={usuarios} onIngresar={(u) => setSesion(u.nombreUsuario)} onRegistrar={registrar} />

  // El panel es solo para usuarios logueados: si no hay nadie, se muestra el login
  const paginaPanel = usuario ? (
    <Panel
      usuario={usuario}
      apadrinados={misApadrinados}
      animalesFavoritos={animalesFavoritos}
      onFavorito={alternarFavorito}
      onVerCatalogo={() => irA('/catalogo')}
      onVerApadrinado={verApadrinado}
      onVerAnimal={verAnimal}
    />
  ) : (
    login
  )

  // Para pagar hace falta tener algo en el carrito y haber entrado
  const elegirPaginaPago = () => {
    if (carrito.length === 0) {
      return <Navigate to="/carrito" replace />
    }
    if (!usuario) {
      return login
    }
    return <Pago carrito={carrito} conBotiquin={conBotiquin} onConfirmar={confirmarCarrito} onVolver={() => irA('/carrito')} />
  }

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
            <Route
              path="/catalogo"
              element={<Catalogo animales={animales} favoritos={favoritos} onFavorito={alternarFavorito} onVerAnimal={verAnimal} />}
            />
            <Route
              path="/animal/:id"
              element={
                <Detalle
                  animales={animales}
                  favoritos={favoritos}
                  onFavorito={alternarFavorito}
                  puedeApadrinar={puedeApadrinar}
                  onAgregar={agregarAlCarrito}
                  onVolver={() => irA('/catalogo')}
                />
              }
            />

            {/* Admin y refugio no apadrinan: no tienen carrito, pago ni panel de padrino, van directo a su panel */}
            <Route
              path="/carrito"
              element={
                puedeApadrinar ? (
                  <Carrito
                    carrito={carrito}
                    conBotiquin={conBotiquin}
                    onBotiquin={setConBotiquin}
                    onQuitar={quitarDelCarrito}
                    onPagar={() => irA('/pago')}
                    onVerCatalogo={() => irA('/catalogo')}
                  />
                ) : (
                  <Navigate to={panelPropio} replace />
                )
              }
            />
            <Route path="/pago" element={puedeApadrinar ? elegirPaginaPago() : <Navigate to={panelPropio} replace />} />
            <Route
              path="/gracias"
              element={
                ultimaCompra ? (
                  <Gracias compra={ultimaCompra} onVerPanel={() => irA('/panel')} onVerCatalogo={() => irA('/catalogo')} />
                ) : (
                  <Navigate to="/panel" replace />
                )
              }
            />
            <Route path="/panel" element={puedeApadrinar ? paginaPanel : <Navigate to={panelPropio} replace />} />
            <Route
              path="/panel/:id"
              element={
                <Apadrinado
                  apadrinados={misApadrinados}
                  novedades={novedades}
                  onVolver={() => irA('/panel')}
                  onCambiarPlan={cambiarPlan}
                  onCancelar={cancelarApadrinamiento}
                  onVerCertificado={(item) => irA(`/panel/${item.animal.id}/certificado`)}
                />
              }
            />
            <Route path="/panel/:id/certificado" element={<Certificado usuario={usuario} apadrinados={misApadrinados} onVolver={verApadrinado} />} />

            {/* Solo entra un administrador: el resto va al panel (o al login) */}
            <Route
              path="/admin"
              element={
                esAdmin ? (
                  <Admin
                    usuario={usuario}
                    usuarios={usuarios}
                    animales={animales}
                    apadrinamientos={apadrinamientos}
                    onCambiarRol={cambiarRol}
                    onCambiarActivo={cambiarActivo}
                    onAprobar={aprobarRefugio}
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
                  <Refugio
                    usuario={usuario}
                    usuarios={usuarios}
                    animales={animales}
                    apadrinamientos={apadrinamientos}
                    onAgregar={agregarAnimal}
                    onQuitar={quitarAnimal}
                    onEditarAnimal={editarAnimal}
                    onPublicarNovedad={publicarNovedad}
                    onVerAnimal={verAnimal}
                  />
                ) : (
                  <Navigate to="/panel" replace />
                )
              }
            />

            {/* Cualquier otra dirección muestra la página de "no encontrada" */}
            <Route path="*" element={<NoEncontrada onVolver={() => irA('/')} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ContextoMoneda.Provider>
  )
}

export default App
