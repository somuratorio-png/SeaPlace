import { useEffect, useState } from 'react'
import {Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AvisoError from './components/comunes/AvisoError'
import Cargando from './components/comunes/Cargando'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import SinConexion from './components/comunes/SinConexion'
import { ContextoMoneda } from './contexto/Moneda'
import { ContextoPlanes } from './contexto/Planes'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import { traerInicio } from './services/inicio'
import * as usuariosApi from './services/usuarios'
import Admin from './views/Admin'
import NoEncontrada from './views/NoEncontrada'
import Apadrinado from './views/Apadrinado'
import Muelle from './views/Muelle'
import Catalogo from './views/Catalogo'
import Certificado from './views/Certificado'
import Cuenta from './views/Cuenta'
import Detalle from './views/Detalle'
import Gracias from './views/Gracias'
import Inicio from './views/Inicio'
import Zarpar from './views/Zarpar'
import Panel from './views/Panel'
import Refugio from './views/Refugio'
import ConSesion from './components/rutas/ConSesion'
import SoloAdmin from './components/rutas/SoloAdmin'
import SoloPadrinos from './components/rutas/SoloPadrinos'
import SoloRefugio from './components/rutas/SoloRefugio'
import { ponerEnElMuelle } from './services/apadrinar'
import { SIN_MUELLE } from './utils/muelle'

// App es el componente principal: tiene el ruteo y lo que es de toda la app y no de una pantalla:
// quién está logueado, sus favoritos, su muelle y los planes.
// Los listados (animales, categorías, apadrinamientos, usuarios...) los pide cada página al backend
// cuando se monta, en su propio useEffect (ver src/views).
const App = () => {
  const [planes, setPlanes] = useState([])
  const [usuario, setUsuario] = useState(null) // quien está logueado, o null
  const [favoritos, setFavoritos] = useState([]) // los animales que guardó
  const [muelle, setMuelle] = useState(SIN_MUELLE)
  const [cargando, setCargando] = useState(true)
  const [sinConexion, setSinConexion] = useState(null) // mensaje si el backend no respondió al arrancar
  const [intento, setIntento] = useState(0) // cuántas veces se volvió a intentar
  const [error, setError] = useState(null) // mensaje del último pedido que falló
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'. Queda guardada en el navegador

  const navigate = useNavigate()
  const { pathname, state } = useLocation() // la ruta actual, por ejemplo '/catalogo', y lo que viaja con la navegación

  // Al abrir la página se piden, una sola vez, los planes y (si quedó un token guardado de una visita
  // anterior) la sesión de ese usuario. "intento" solo cambia con el botón de reintentar
  // (cuando el backend no respondía): ahí el efecto se ejecuta de nuevo.
  useEffect(() => {
    traerInicio()
      .then((inicio) => {
        setPlanes(inicio.planes)

        const sesion = inicio.sesion
        if (!sesion) {
          // No había token, venció o la cuenta fue dada de baja: se sigue sin sesión
          usuariosApi.salir()
          return
        }
        setFavoritos(sesion.favoritos)
        setMuelle(sesion.muelle)
        setUsuario(sesion.usuario)
      })
      .catch((falla) => {
        setSinConexion(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [intento])

  const reintentar = () => {
    setSinConexion(null)
    setCargando(true)
    setIntento(intento + 1)
  }

  const esAdmin = usuario !== null && usuario.rol === 'administrador'
  const esRefugio = usuario !== null && usuario.rol === 'refugio'
  // Solo apadrinan los padrinos (y quien todavía no entró). Admin y refugio tienen su propio panel.
  const puedeApadrinar = !esAdmin && !esRefugio

  const irA = (ruta) => {
    setError(null)
    navigate(ruta)
  }

  const verAnimal = (animal) => {
    irA(`/animal/${animal.id}`)
  }

  const verApadrinado = (item) => {
    irA(`/panel/${item.animal.id}`)
  }

  const verCertificado = (item) => {
    irA(`/panel/${item.animal.id}/certificado`)
  }

  // ---------- Sesión ----------

  // La llama el login cuando el backend aceptó el usuario y la contraseña (o el registro), con la
  // sesión que vino en esa respuesta: deja logueado a ese usuario con sus favoritos y su muelle.
  // Si antes de entrar había elegido un animal para apadrinar, se lo agrega al muelle y lo lleva ahí.
    const entrar = (sesion) => {
    setFavoritos(sesion.favoritos)
    setMuelle(sesion.muelle)
    setUsuario(sesion.usuario)

    // Si antes de entrar había elegido un animal para apadrinar (viaja en la navegación),
    // se lo agrega al muelle y lo lleva ahí.
    const puede = sesion.usuario.rol !== 'administrador' && sesion.usuario.rol !== 'refugio'
    if (state !== null && state.pendiente && puede) {
      ponerEnElMuelle(sesion.muelle, state.pendiente.idAnimal, state.pendiente.codigoPlan)
        .then((muelleNuevo) => {
          setMuelle(muelleNuevo)
          navigate('/muelle')
        })
        .catch((falla) => {
          setError(falla.message)
        })
    }
  }

  const salir = () => {
    usuariosApi.salir()
    setUsuario(null)
    setFavoritos([])
    setMuelle(SIN_MUELLE)
    irA('/')
  }


  // El contenido de <main>: un aviso mientras llega la respuesta, el error si el backend no respondió, o la página de la ruta actual
  const elegirContenido = () => {
    if (cargando) {
      return <Cargando texto="Cargando SeaPlace…" />
    }
    if (sinConexion) {
      return <SinConexion mensaje={sinConexion} onReintentar={reintentar} />
    }
    return (
      <Routes>
        <Route path="/" element={<Inicio onVerCatalogo={() => irA('/catalogo')} onVerAnimal={verAnimal} />} />
        <Route
          path="/catalogo"
          element={<Catalogo usuario={usuario} favoritos={favoritos} onCambiarFavoritos={setFavoritos} onError={setError} onVerAnimal={verAnimal} />}
        />
        <Route
          path="/animal/:id"
          element={
            <Detalle
              usuario={usuario}
              favoritos={favoritos}
              onCambiarFavoritos={setFavoritos}
              onError={setError}
              muelle={muelle}
              onCambiarMuelle={setMuelle}
              puedeApadrinar={puedeApadrinar}
              onVolver={() => irA('/catalogo')}
            />
          }
        />
                  <Route
          path="/muelle"
          element={
            <SoloPadrinos usuario={usuario}>
              <Muelle idMuelle={muelle.id} muelle={muelle.items} onCambiarMuelle={setMuelle} onError={setError} />
            </SoloPadrinos>
          }
        />
        <Route
          path="/zarpar"
          element={
            <SoloPadrinos usuario={usuario}>
              <ConSesion usuario={usuario} onEntrar={entrar}>
                <Zarpar idMuelle={muelle.id} muelle={muelle.items} onCambiarMuelle={setMuelle} />
              </ConSesion>
            </SoloPadrinos>
          }
        />
        <Route path="/gracias" element={<Gracias />} />  
        <Route
          path="/panel"
          element={
            <SoloPadrinos usuario={usuario}>
              <ConSesion usuario={usuario} onEntrar={entrar}>
                <Panel
                  usuario={usuario}
                  favoritos={favoritos}
                  onCambiarFavoritos={setFavoritos}
                  onError={setError}
                  onVerCatalogo={() => irA('/catalogo')}
                  onVerApadrinado={verApadrinado}
                  onVerAnimal={verAnimal}
                />
              </ConSesion>
            </SoloPadrinos>
          }
        />
        <Route
          path="/panel/:id"
          element={
            <SoloPadrinos usuario={usuario}>
              <ConSesion usuario={usuario} onEntrar={entrar}>
                <Apadrinado onVolver={() => irA('/panel')} onVerCertificado={verCertificado} onError={setError} />
              </ConSesion>
            </SoloPadrinos>
          }
        />
        <Route
          path="/panel/:id/certificado"
          element={
            <SoloPadrinos usuario={usuario}>
              <ConSesion usuario={usuario} onEntrar={entrar}>
                <Certificado usuario={usuario} onVolver={verApadrinado} />
              </ConSesion>
            </SoloPadrinos>
          }
        />
        <Route
          path="/cuenta"
          element={
            <ConSesion usuario={usuario} onEntrar={entrar}>
              <Cuenta usuario={usuario} onPerfilGuardado={setUsuario} />
            </ConSesion>
          }
        />
        <Route
          path="/admin"
          element={
            <SoloAdmin usuario={usuario}>
              <Admin usuario={usuario} onVerAnimal={verAnimal} onError={setError} />
            </SoloAdmin>
          }
        />
        <Route
          path="/refugio"
          element={
            <SoloRefugio usuario={usuario}>
              <Refugio usuario={usuario} onVerAnimal={verAnimal} onError={setError} />
            </SoloRefugio>
          }
        />
                {/* Cualquier otra dirección muestra la página de "no encontrada" */}
        <Route path="*" element={<NoEncontrada onVolver={() => irA('/')} />} />
      </Routes>
    )
  }

  return (
    // ContextoMoneda comparte la moneda elegida con todos los componentes que muestran precios,
    // y ContextoPlanes los niveles de apadrinamiento con los que arman los planes de un animal
    <ContextoMoneda.Provider value={moneda}>
      <ContextoPlanes.Provider value={planes}>
        {/* flex + min-h-screen + flex-1 en <main>: el footer queda siempre abajo, aunque la página sea corta */}
        <div className="min-h-screen flex flex-col fondo-playa font-body-md text-on-surface">
          {/* El header y el footer están fuera de <Routes>: se ven en todas las páginas */}
          <Header
            rutaActual={pathname}
            cantidadMuelle={muelle.items.length}
            usuario={usuario}
            moneda={moneda}
            onCambiarMoneda={setMoneda}
            onNavegar={irA}
            onUsarLink={() => setError(null)}
            onSalir={salir}
          />

          <main key={pathname} className="flex-1">
            {/* Al cambiar la ruta, la key vuelve a montar <main>: React enfoca este botón invisible
                y el navegador lleva la pantalla hasta arriba */}
            <button tabIndex={-1} autoFocus aria-hidden="true" className="ancla-arriba" />
            {/* El último pedido al backend que falló, con su mensaje */}
            {error && (
              <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-sm print:hidden">
                <AvisoError mensaje={error} onCerrar={() => setError(null)} />
              </div>
            )}

            {elegirContenido()}
          </main>

          <Footer />
        </div>
      </ContextoPlanes.Provider>
    </ContextoMoneda.Provider>
  )
}

export default App
