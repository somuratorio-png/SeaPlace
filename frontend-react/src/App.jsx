import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AvisoError from './components/comunes/AvisoError'
import Cargando from './components/comunes/Cargando'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { ContextoMoneda } from './contexto/Moneda'
import { ContextoPlanes } from './contexto/Planes'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import * as animalesApi from './services/animales'
import * as apadrinarApi from './services/apadrinar'
import { hayToken } from './services/api'
import * as usuariosApi from './services/usuarios'
import { ponerEn, sacarDe } from './utils/listas'
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

// El muelle cuando todavía no se conoce el del usuario. items: [{ animal, plan, cantidad }]
const SIN_MUELLE = { id: null, items: [] }

// Lo que hace falta tener a mano de quien entra, porque lo usan varias páginas: sus favoritos,
// su muelle, sus apadrinamientos y las publicaciones pausadas que puede ver.
// Admin y refugio no apadrinan (no tienen muelle ni apadrinamientos propios); el resto no ve publicaciones pausadas.
const traerDatosDe = (quien) => {
  const esAdmin = quien.rol === 'administrador'
  const esRefugio = quien.rol === 'refugio'
  const apadrina = !esAdmin && !esRefugio

  return Promise.all([
    apadrinarApi.traerFavoritos(),
    apadrina ? apadrinarApi.traerMuelle() : SIN_MUELLE,
    esAdmin || (esRefugio && quien.idRefugio) ? animalesApi.traerAnimales('PAUSADA') : [],
    apadrina ? apadrinarApi.traerApadrinamientos() : [],
  ]).then(([favoritos, muelle, pausados, apadrinamientos]) => ({ favoritos, muelle, pausados, apadrinamientos }))
}

// El muelle con ese ítem puesto: si el animal ya estaba, lo reemplaza; si no, lo agrega
const conItem = (muelle, item) => {
  const yaEstaba = muelle.items.some((otro) => otro.animal.id === item.animal.id)
  const items = yaEstaba ? muelle.items.map((otro) => (otro.animal.id === item.animal.id ? item : otro)) : [...muelle.items, item]
  return { ...muelle, items }
}

// El animal después de que le tomaron "cantidad" cupos (el progreso es el porcentaje de cupos tomados)
const conCuposTomados = (animal, cantidad) => {
  const cuposDisponibles = animal.cuposDisponibles - cantidad
  const progreso = Math.round(((animal.cuposTotales - cuposDisponibles) * 100) / animal.cuposTotales)
  return { ...animal, cuposDisponibles, progreso }
}

// App es el componente principal: tiene el ruteo y el estado que comparten varias páginas
// (el catálogo, quién está logueado, sus favoritos y su muelle), que les pasa por props.
// Lo que usa una sola página lo pide esa página en su propio useEffect (ver src/views).
// Cada acción llama primero a la API y, con lo que contesta, actualiza el estado: no se vuelve a pedir la lista.
const App = () => {
  const [animales, setAnimales] = useState([]) // las publicaciones activas: es el catálogo
  const [categorias, setCategorias] = useState([])
  const [planes, setPlanes] = useState([])
  const [usuario, setUsuario] = useState(null) // quien está logueado, o null
  const [favoritos, setFavoritos] = useState([]) // ids de animales
  const [muelle, setMuelle] = useState(SIN_MUELLE)
  const [apadrinamientos, setApadrinamientos] = useState([]) // los del padrino logueado, activos y cancelados
  const [pausados, setPausados] = useState([]) // publicaciones pausadas (refugio: las suyas; administrador: todas)
  const [cargando, setCargando] = useState(true)
  const [sinConexion, setSinConexion] = useState(null) // mensaje si no se pudo traer el catálogo al arrancar
  const [intento, setIntento] = useState(0) // cuántas veces se volvió a intentar traer el catálogo
  const [error, setError] = useState(null) // mensaje del último pedido que falló
  const [pendiente, setPendiente] = useState(null) // { animal, plan } elegido antes de iniciar sesión
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'. Queda guardada en el navegador
  const [conBotiquin, setConBotiquin] = useState(false)
  const [ultimoZarpar, setUltimoZarpar] = useState(null) // { apadrinados, total } para la página de gracias

  const navigate = useNavigate()
  const { pathname } = useLocation() // la ruta actual, por ejemplo '/catalogo'

  // Al abrir la página se pide el catálogo, una sola vez. Si quedó un token guardado de una visita
  // anterior, también se recupera la sesión. "intento" solo cambia con el botón de reintentar
  // (cuando el backend no respondía): ahí el efecto se ejecuta de nuevo.
  useEffect(() => {
    Promise.all([animalesApi.traerAnimales(), animalesApi.traerCategorias(), apadrinarApi.traerPlanes()])
      .then(([listaAnimales, listaCategorias, listaPlanes]) => {
        setAnimales(listaAnimales)
        setCategorias(listaCategorias)
        setPlanes(listaPlanes)

        if (!hayToken()) {
          return null
        }
        return usuariosApi
          .traerMiUsuario()
          .then((quien) =>
            traerDatosDe(quien).then((datos) => {
              setFavoritos(datos.favoritos)
              setMuelle(datos.muelle)
              setPausados(datos.pausados)
              setApadrinamientos(datos.apadrinamientos)
              setUsuario(quien)
            }),
          )
          .catch(() => {
            // El token venció o la cuenta fue dada de baja: se sigue sin sesión
            usuariosApi.salir()
          })
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

  // Las publicaciones activas más las pausadas que puede ver quien está logueado
  const todosLosAnimales = [...animales, ...pausados]

  const animalesFavoritos = animales.filter((animal) => favoritos.includes(animal.id))

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

  // La llama el login cuando el backend aceptó el usuario y la contraseña (o el registro).
  // Deja logueado a "quien" con sus datos. Si antes de entrar había elegido un animal para
  // apadrinar, se lo agrega al muelle y lo lleva ahí.
  const entrar = (quien) =>
    traerDatosDe(quien).then((datos) => {
      setFavoritos(datos.favoritos)
      setMuelle(datos.muelle)
      setPausados(datos.pausados)
      setApadrinamientos(datos.apadrinamientos)
      setUsuario(quien)
      setPendiente(null)

      const puede = quien.rol !== 'administrador' && quien.rol !== 'refugio'
      if (pendiente && puede) {
        ponerEnElMuelle(datos.muelle, pendiente.animal, pendiente.plan)
          .then((muelleNuevo) => {
            setMuelle(muelleNuevo)
            navigate('/muelle')
          })
          .catch((falla) => {
            setError(falla.message)
          })
      }
    })

  const salir = () => {
    usuariosApi.salir()
    setUsuario(null)
    setFavoritos([])
    setMuelle(SIN_MUELLE)
    setApadrinamientos([])
    setPausados([])
    setConBotiquin(false)
    setUltimoZarpar(null)
    irA('/')
  }

  // ---------- Favoritos y muelle ----------

  // Los favoritos se guardan en la cuenta: si no hay nadie logueado, primero hay que entrar
  const alternarFavorito = (idAnimal) => {
    if (!usuario) {
      irA('/panel')
      return
    }
    setError(null)
    const yaEra = favoritos.includes(idAnimal)
    const pedido = yaEra ? apadrinarApi.quitarFavorito(idAnimal) : apadrinarApi.agregarFavorito(idAnimal)
    pedido
      .then(() => {
        setFavoritos(yaEra ? favoritos.filter((id) => id !== idAnimal) : [...favoritos, idAnimal])
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  // Le pide al backend que ponga el animal en ese muelle y devuelve una promesa con el muelle como queda.
  // Si el animal ya estaba, solo se le cambia el plan (conserva los cupos elegidos).
  const ponerEnElMuelle = (muelleActual, animal, plan) => {
    const yaEstaba = muelleActual.items.find((item) => item.animal.id === animal.id)
    const pedido = yaEstaba
      ? apadrinarApi.cambiarItem(muelleActual.id, animal.id, yaEstaba.cantidad, plan.codigo)
      : apadrinarApi.agregarAlMuelle(muelleActual.id, animal.id, plan.codigo)
    return pedido.then((item) => conItem(muelleActual, item))
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
    // Al zarpar, el muelle que se pagó queda cerrado: el siguiente se le pide al backend recién
    // cuando hace falta, que es acá
    const muelleListo = muelle.id === null ? apadrinarApi.traerMuelle() : Promise.resolve(muelle)
    muelleListo
      .then((muelleActual) => ponerEnElMuelle(muelleActual, animal, plan))
      .then((muelleNuevo) => {
        setMuelle(muelleNuevo)
        setUltimoZarpar(null) // empieza un pedido nuevo: la página de gracias del anterior ya no hace falta
        navigate('/muelle')
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  // Botones de más y menos: la cantidad son los cupos que se quieren tomar de ese animal.
  // Va de 1 hasta los cupos que le quedan disponibles (igual que valida el backend).
  const cambiarCantidad = (idAnimal, cantidad) => {
    const item = muelle.items.find((i) => i.animal.id === idAnimal)
    const acotada = Math.min(item.animal.cuposDisponibles, Math.max(1, cantidad))
    setError(null)
    apadrinarApi
      .cambiarItem(muelle.id, idAnimal, acotada)
      .then((cambiado) => {
        setMuelle(conItem(muelle, cambiado))
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  const quitarDelMuelle = (idAnimal) => {
    setError(null)
    apadrinarApi
      .quitarDelMuelle(muelle.id, idAnimal)
      .then(() => {
        setMuelle({ ...muelle, items: muelle.items.filter((i) => i.animal.id !== idAnimal) })
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  // Zarpar = confirmar el muelle. Se llama cuando el pago salió bien. El backend vuelve a validar los cupos,
  // convierte cada ítem en un apadrinamiento del usuario, descuenta los cupos y cierra el muelle.
  // Devuelve una promesa con el mensaje de error (por ejemplo, si a un animal ya no le quedan cupos), o null si salió bien.
  const zarpar = () => {
    const pagados = muelle.items
    return apadrinarApi
      .zarpar(muelle.id, conBotiquin)
      .then((total) =>
        // El pago crea apadrinamientos y la respuesta de zarpar no los trae: se piden una vez, acá.
        // Si ese pedido falla el pago igual quedó hecho: se sigue con la lista que había.
        apadrinarApi
          .traerApadrinamientos()
          .catch(() => apadrinamientos)
          .then((lista) => {
            // Lo que cambió con el pago se refleja acá mismo: a cada animal le quedan menos cupos y el muelle queda vacío
            setAnimales(
              animales.map((animal) => {
                const item = pagados.find((i) => i.animal.id === animal.id)
                return item ? conCuposTomados(animal, item.cantidad) : animal
              }),
            )
            setApadrinamientos(lista)
            setUltimoZarpar({ apadrinados: pagados.map((item) => ({ id: item.animal.id, animal: item.animal, plan: item.plan })), total })
            setMuelle(SIN_MUELLE)
            setConBotiquin(false)
            irA('/gracias')
            return null
          }),
      )
      .catch((falla) => falla.message)
  }

  // Un apadrinamiento como lo devolvió el backend después de cambiarle el plan o cancelarlo
  const guardarApadrinamiento = (apadrinamiento) => {
    setApadrinamientos((actuales) => ponerEn(actuales, apadrinamiento))
  }

  // ---------- Cambios en el catálogo ----------
  // Los paneles del refugio y del administrador (y el padrino, cuando cancela un apadrinamiento) llaman
  // al backend y después avisan acá con lo que les contestó, para que el cambio se vea en todas las páginas.

  // Guarda un animal nuevo o modificado en la lista que le toca según el estado de su publicación
  const guardarAnimal = (animal) => {
    const activa = animal.publicacion === 'ACTIVA'
    const pausadaVisible = animal.publicacion === 'PAUSADA' && (esAdmin || esRefugio)
    setAnimales((actuales) => (activa ? ponerEn(actuales, animal) : sacarDe(actuales, animal.id)))
    setPausados((actuales) => (pausadaVisible ? ponerEn(actuales, animal) : sacarDe(actuales, animal.id)))
  }

  // La publicación fue eliminada: deja de verse
  const sacarAnimal = (idAnimal) => {
    setAnimales((actuales) => sacarDe(actuales, idAnimal))
    setPausados((actuales) => sacarDe(actuales, idAnimal))
  }

  // Al dar de baja a un refugio, el backend pausa sus publicaciones activas
  const pausarAnimalesDe = (idRefugio) => {
    const suyos = animales.filter((animal) => animal.idRefugio === idRefugio)
    setAnimales(animales.filter((animal) => animal.idRefugio !== idRefugio))
    setPausados([...pausados, ...suyos.map((animal) => ({ ...animal, publicacion: 'PAUSADA' }))])
  }

  const agregarCategoria = (categoria) => {
    setCategorias([...categorias, categoria])
  }

  // ---------- Páginas que dependen de quién está logueado ----------

  const login = <Login onEntrar={entrar} />

  // El panel es solo para usuarios logueados: si no hay nadie, se muestra el login
  const paginaPanel = usuario ? (
    <Panel
      usuario={usuario}
      apadrinamientos={apadrinamientos}
      animalesFavoritos={animalesFavoritos}
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
    return <Zarpar muelle={muelle.items} conBotiquin={conBotiquin} onConfirmar={zarpar} onVolver={() => irA('/muelle')} />
  }

  // El contenido de <main>: un aviso mientras llega el catálogo, el error si el backend no respondió, o la página de la ruta actual
  const elegirContenido = () => {
    if (cargando) {
      return <Cargando texto="Cargando SeaPlace…" />
    }
    if (sinConexion) {
      return (
        <div className="max-w-2xl mx-auto px-margin-mobile py-space-xl space-y-space-md text-center">
          <AvisoError mensaje={sinConexion} />
          <button onClick={reintentar} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
            Volver a intentar
          </button>
        </div>
      )
    }
    return (
      <Routes>
        <Route path="/" element={<Inicio animales={animales} onVerCatalogo={() => irA('/catalogo')} onVerAnimal={verAnimal} />} />
        <Route
          path="/catalogo"
          element={<Catalogo animales={animales} categorias={categorias} favoritos={favoritos} onFavorito={alternarFavorito} onVerAnimal={verAnimal} />}
        />
        <Route
          path="/animal/:id"
          element={
            <Detalle
              animales={todosLosAnimales}
              favoritos={favoritos}
              onFavorito={alternarFavorito}
              puedeApadrinar={puedeApadrinar}
              onAgregar={agregarAlMuelle}
              onVolver={() => irA('/catalogo')}
            />
          }
        />

        {/* Admin y refugio no apadrinan: no tienen muelle, zarpar ni panel de padrino, van directo a su panel */}
        <Route
          path="/muelle"
          element={
            puedeApadrinar ? (
              <Muelle
                muelle={muelle.items}
                conBotiquin={conBotiquin}
                onBotiquin={setConBotiquin}
                onCantidad={cambiarCantidad}
                onQuitar={quitarDelMuelle}
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
              <Apadrinado
                apadrinamientos={apadrinamientos}
                onVolver={() => irA('/panel')}
                onVerCertificado={verCertificado}
                onGuardarApadrinamiento={guardarApadrinamiento}
                onGuardarAnimal={guardarAnimal}
                onError={setError}
              />
            ) : (
              <Navigate to="/panel" replace />
            )
          }
        />
        <Route
          path="/panel/:id/certificado"
          element={usuario && puedeApadrinar ? <Certificado usuario={usuario} apadrinamientos={apadrinamientos} onVolver={verApadrinado} /> : <Navigate to="/panel" replace />}
        />

        {/* "Mi cuenta" es para cualquiera que haya entrado: si no hay nadie, se muestra el login */}
        <Route path="/cuenta" element={usuario ? <Cuenta usuario={usuario} onPerfilGuardado={setUsuario} /> : login} />

        {/* Solo entra un administrador: el resto va al panel (o al login) */}
        <Route
          path="/admin"
          element={
            esAdmin ? (
              <Admin
                usuario={usuario}
                categorias={categorias}
                animales={todosLosAnimales}
                onVerAnimal={verAnimal}
                onAnimalQuitado={sacarAnimal}
                onRefugioDeBaja={pausarAnimalesDe}
                onCategoriaCreada={agregarCategoria}
                onError={setError}
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
                animales={todosLosAnimales}
                categorias={categorias}
                onGuardarAnimal={guardarAnimal}
                onAnimalQuitado={sacarAnimal}
                onVerAnimal={verAnimal}
                onError={setError}
              />
            ) : (
              <Navigate to="/panel" replace />
            )
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
