import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AvisoError from './components/comunes/AvisoError'
import Cargando from './components/comunes/Cargando'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import SinConexion from './components/comunes/SinConexion'
import { ContextoMoneda } from './contexto/Moneda'
import { ContextoPlanes } from './contexto/Planes'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import * as apadrinarApi from './services/apadrinar'
import { traerInicio } from './services/inicio'
import * as usuariosApi from './services/usuarios'
import { conItem, SIN_MUELLE } from './utils/muelle'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Muelle from './views/Muelle'
import Catalogo from './views/Catalogo'
import Certificado from './views/Certificado'
import Cuenta from './views/Cuenta'
import Detalle from './views/Detalle'
import Gracias from './views/Gracias'
import Inicio from './views/Inicio'
import Login from './views/Login'
import NoEncontrada from './views/NoEncontrada'
import Zarpar from './views/Zarpar'
import Panel from './views/Panel'
import Refugio from './views/Refugio'

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
  const [pendiente, setPendiente] = useState(null) // { animal, plan } elegido antes de iniciar sesión
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'. Queda guardada en el navegador
  const [conBotiquin, setConBotiquin] = useState(false)
  const [ultimoZarpar, setUltimoZarpar] = useState(null) // { apadrinados, total } para la página de gracias

  const navigate = useNavigate()
  const { pathname } = useLocation() // la ruta actual, por ejemplo '/catalogo'

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
  const panelPropio = esAdmin ? '/admin' : '/refugio'

  const idsFavoritos = favoritos.map((animal) => animal.id)

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
    setPendiente(null)

    const puede = sesion.usuario.rol !== 'administrador' && sesion.usuario.rol !== 'refugio'
    if (pendiente && puede) {
      ponerEnElMuelle(sesion.muelle, pendiente.animal, pendiente.plan)
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
    setConBotiquin(false)
    setUltimoZarpar(null)
    irA('/')
  }

  // ---------- Favoritos y muelle ----------

  // Los favoritos se guardan en la cuenta: si no hay nadie logueado, primero hay que entrar.
  // El cambio se ve con lo que contesta el backend, sin volver a pedir la lista.
  const alternarFavorito = (idAnimal) => {
    if (!usuario) {
      irA('/panel')
      return
    }
    setError(null)
    const yaEra = idsFavoritos.includes(idAnimal)
    const pedido = yaEra
      ? apadrinarApi.quitarFavorito(idAnimal).then(() => favoritos.filter((animal) => animal.id !== idAnimal))
      : apadrinarApi.agregarFavorito(idAnimal).then((animal) => [...favoritos, animal])
    pedido.then(setFavoritos).catch((falla) => {
      setError(falla.message)
    })
  }

  // Le pide al backend que ponga el animal en ese muelle y devuelve una promesa con el muelle como queda.
  // Si el animal ya estaba, solo se le cambia el plan (conserva los cupos elegidos).
  // Al zarpar, el muelle que se pagó queda cerrado (id en null): el backend abre el siguiente al
  // agregarle el primer animal, y el ítem que devuelve trae el id del muelle.
  const ponerEnElMuelle = (muelleActual, animal, plan) => {
    const yaEstaba = muelleActual.items.find((item) => item.animal.id === animal.id)
    const pedido = yaEstaba
      ? apadrinarApi.cambiarItem(muelleActual.id, animal.id, yaEstaba.cantidad, plan.codigo)
      : apadrinarApi.agregarAlMuelle(muelleActual.id, animal.id, plan.codigo)
    return pedido.then((item) => conItem({ ...muelleActual, id: item.idMuelle }, item))
  }

  // El muelle es de cada usuario: quien no entró primero pasa por el login, y el animal
  // elegido queda esperando en "pendiente" hasta que entre
  const agregarAlMuelle = (animal, plan) => {
    if (!usuario) {
      setPendiente({ animal, plan })
      irA('/panel')
      return
    }
    setError(null)
    ponerEnElMuelle(muelle, animal, plan)
      .then((muelleNuevo) => {
        setMuelle(muelleNuevo)
        setUltimoZarpar(null) // empieza un pedido nuevo: la página de gracias del anterior ya no hace falta
        navigate('/muelle')
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  // La página del muelle llama al backend cuando se cambia una cantidad o se quita un animal,
  // y avisa acá con los ítems como quedaron
  const guardarItemsDelMuelle = (items) => {
    setMuelle({ ...muelle, items })
  }

  // La página de zarpar avisa acá cuando el pago salió bien, con el total que cobró el backend:
  // el muelle queda vacío y se pasa a la página de gracias con lo que se pagó.
  const registrarZarpar = (total) => {
    setUltimoZarpar({ apadrinados: muelle.items.map((item) => ({ id: item.animal.id, animal: item.animal, plan: item.plan })), total })
    setMuelle(SIN_MUELLE)
    setConBotiquin(false)
    irA('/gracias')
  }

  // ---------- Páginas que dependen de quién está logueado ----------

  const login = <Login onEntrar={entrar} />

  // El panel es solo para usuarios logueados: si no hay nadie, se muestra el login.
  // Los favoritos que se muestran son los que siguen publicados.
  const paginaPanel = usuario ? (
    <Panel
      usuario={usuario}
      animalesFavoritos={favoritos.filter((animal) => animal.publicacion === 'ACTIVA')}
      onFavorito={alternarFavorito}
      onVerCatalogo={() => irA('/catalogo')}
      onVerApadrinado={verApadrinado}
      onVerAnimal={verAnimal}
    />
  ) : (
    login
  )

  // Para zarpar hace falta tener algo en el muelle y haber entrado
  const elegirPaginaZarpar = () => {
    if (!usuario) {
      return login
    }
    // Con el muelle vacío no hay nada que pagar. Justo después de zarpar también queda vacío:
    // en ese caso se pasa a la página de gracias de ese pago.
    if (muelle.items.length === 0) {
      return <Navigate to={ultimoZarpar ? '/gracias' : '/muelle'} replace />
    }
    return <Zarpar idMuelle={muelle.id} muelle={muelle.items} conBotiquin={conBotiquin} onZarpado={registrarZarpar} onVolver={() => irA('/muelle')} />
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
        <Route path="/catalogo" element={<Catalogo favoritos={idsFavoritos} onFavorito={alternarFavorito} onVerAnimal={verAnimal} />} />
        <Route
          path="/animal/:id"
          element={
            <Detalle favoritos={idsFavoritos} onFavorito={alternarFavorito} puedeApadrinar={puedeApadrinar} onAgregar={agregarAlMuelle} onVolver={() => irA('/catalogo')} />
          }
        />

        {/* Admin y refugio no apadrinan: no tienen muelle, zarpar ni panel de padrino, van directo a su panel */}
        <Route
          path="/muelle"
          element={
            puedeApadrinar ? (
              <Muelle
                idMuelle={muelle.id}
                muelle={muelle.items}
                conBotiquin={conBotiquin}
                onBotiquin={setConBotiquin}
                onCambiar={guardarItemsDelMuelle}
                onError={setError}
                onZarpar={() => irA('/zarpar')}
                onVerCatalogo={() => irA('/catalogo')}
              />
            ) : (
              <Navigate to={panelPropio} replace />
            )
          }
        />
        <Route path="/zarpar" element={puedeApadrinar ? elegirPaginaZarpar() : <Navigate to={panelPropio} replace />} />
        <Route
          path="/gracias"
          element={
            ultimoZarpar ? (
              <Gracias zarpar={ultimoZarpar} onVerCertificado={verCertificado} onVerPanel={() => irA('/panel')} onVerCatalogo={() => irA('/catalogo')} />
            ) : (
              <Navigate to="/panel" replace />
            )
          }
        />
        <Route path="/panel" element={puedeApadrinar ? paginaPanel : <Navigate to={panelPropio} replace />} />
        {/* El detalle de un apadrinado y su certificado son solo del padrino que entró: el resto vuelve al panel */}
        <Route
          path="/panel/:id"
          element={
            usuario && puedeApadrinar ? (
              <Apadrinado onVolver={() => irA('/panel')} onVerCertificado={verCertificado} onError={setError} />
            ) : (
              <Navigate to="/panel" replace />
            )
          }
        />
        <Route
          path="/panel/:id/certificado"
          element={usuario && puedeApadrinar ? <Certificado usuario={usuario} onVolver={verApadrinado} /> : <Navigate to="/panel" replace />}
        />

        {/* "Mi cuenta" es para cualquiera que haya entrado: si no hay nadie, se muestra el login */}
        <Route path="/cuenta" element={usuario ? <Cuenta usuario={usuario} onPerfilGuardado={setUsuario} /> : login} />

        {/* Solo entra un administrador: el resto va al panel (o al login) */}
        <Route path="/admin" element={esAdmin ? <Admin usuario={usuario} onVerAnimal={verAnimal} onError={setError} /> : <Navigate to="/panel" replace />} />
        {/* Solo entra un refugio: el resto va al panel (o al login) */}
        <Route path="/refugio" element={esRefugio ? <Refugio usuario={usuario} onVerAnimal={verAnimal} onError={setError} /> : <Navigate to="/panel" replace />} />

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
