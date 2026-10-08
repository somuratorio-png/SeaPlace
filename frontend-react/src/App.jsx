import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import Icono from './components/comunes/Icono'
import { ContextoMoneda } from './contexto/Moneda'
import { ContextoPlanes } from './contexto/Planes'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import * as animalesApi from './services/animales'
import * as apadrinarApi from './services/apadrinar'
import { hayToken } from './services/api'
import * as usuariosApi from './services/usuarios'
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

// Los datos que dependen de quién está logueado, cuando no hay nadie
const SIN_SESION = {
  muelle: { id: null, items: [] }, // items: [{ animal, plan, cantidad }] cantidad = cupos que se toman
  favoritos: [], // ids de animales
  apadrinamientos: [], // padrino: los suyos; refugio: los de sus animales; administrador: todos
  pausados: [], // publicaciones pausadas (refugio: las suyas; administrador: todas)
  usuarios: [], // solo para el administrador
  roles: [], // solo para el administrador: [{ id, nombre, permisos }]
  permisos: [], // solo para el administrador: [{ id, nombre, descripcion }]
}

// Pide al backend todo lo que necesita ver quien acaba de entrar, según su rol.
// Admin y refugio no apadrinan (no tienen muelle); el resto no ve publicaciones pausadas.
const traerDatosDe = async (quien, planes) => {
  const esAdmin = quien.rol === 'administrador'
  const esRefugio = quien.rol === 'refugio'

  const [favoritos, apadrinamientos, muelle, pausados, usuarios, roles, permisos] = await Promise.all([
    apadrinarApi.traerFavoritos(),
    apadrinarApi.traerApadrinamientos(planes),
    esAdmin || esRefugio ? SIN_SESION.muelle : apadrinarApi.traerMuelle(planes),
    esAdmin || (esRefugio && quien.idRefugio) ? animalesApi.traerAnimales('PAUSADA') : [],
    esAdmin ? usuariosApi.traerUsuarios() : [],
    esAdmin ? usuariosApi.traerRoles() : [],
    esAdmin ? usuariosApi.traerPermisos() : [],
  ])
  return { favoritos, apadrinamientos, muelle, pausados, usuarios, roles, permisos }
}

// App es el componente principal. Guarda el estado que comparten varias páginas
// y se lo pasa a cada una por props. La página que se muestra depende de la URL.
// Los datos viven en el backend: App los pide al arrancar (y al iniciar sesión) usando los
// servicios de src/services, y cada acción llama primero a la API y después actualiza el estado.
const App = () => {
  const [animales, setAnimales] = useState([]) // las publicaciones activas: es el catálogo
  const [categorias, setCategorias] = useState([])
  const [planes, setPlanes] = useState([])
  const [usuario, setUsuario] = useState(null) // quien está logueado, o null
  const [datos, setDatos] = useState(SIN_SESION)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null) // mensaje del último pedido que falló
  const [pendiente, setPendiente] = useState(null) // { animal, plan } elegido antes de iniciar sesión
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'. Queda guardada en el navegador
  const [conBotiquin, setConBotiquin] = useState(false)
  const [ultimoZarpar, setUltimoZarpar] = useState(null) // { apadrinados, total } para la página de gracias

  const navigate = useNavigate()
  const { pathname } = useLocation() // la ruta actual, por ejemplo '/catalogo'

  // Cada vez que se cambia de página (por ejemplo al volver al catálogo), se muestra desde arriba.
  // refArriba apunta al contenedor principal y scrollIntoView lleva la pantalla hasta su comienzo.
  const refArriba = useRef(null)
  useEffect(() => {
    refArriba.current.scrollIntoView()
  }, [pathname])

  // Al abrir la página se pide el catálogo. Si quedó un token guardado de una visita anterior,
  // también se recupera la sesión. En desarrollo React ejecuta los efectos dos veces: yaArranco lo evita.
  const yaArranco = useRef(false)
  useEffect(() => {
    if (yaArranco.current) {
      return
    }
    yaArranco.current = true

    const arrancar = async () => {
      try {
        const [listaAnimales, listaCategorias, listaPlanes] = await Promise.all([
          animalesApi.traerAnimales(),
          animalesApi.traerCategorias(),
          apadrinarApi.traerPlanes(),
        ])
        setAnimales(listaAnimales)
        setCategorias(listaCategorias)
        setPlanes(listaPlanes)

        if (hayToken()) {
          try {
            const quien = await usuariosApi.traerMiUsuario()
            setDatos(await traerDatosDe(quien, listaPlanes))
            setUsuario(quien)
          } catch {
            // El token venció o la cuenta fue dada de baja: se sigue sin sesión
            usuariosApi.salir()
          }
        }
      } catch (falla) {
        setError(falla.message)
      }
      setCargando(false)
    }
    arrancar()
  }, [])

  const esAdmin = usuario !== null && usuario.rol === 'administrador'
  const esRefugio = usuario !== null && usuario.rol === 'refugio'
  // Solo apadrinan los padrinos (y quien todavía no entró). Admin y refugio tienen su propio panel.
  const puedeApadrinar = !esAdmin && !esRefugio
  const panelPropio = esAdmin ? '/admin' : '/refugio'

  // Las publicaciones activas más las pausadas que puede ver quien está logueado
  const todosLosAnimales = [...animales, ...datos.pausados]

  // Los apadrinamientos activos de quien está logueado
  const misApadrinados = datos.apadrinamientos.filter((a) => usuario !== null && a.usuario === usuario.nombreUsuario && a.activo)

  const animalesFavoritos = animales.filter((animal) => datos.favoritos.includes(animal.id))

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

  // Ejecuta una acción que le pide algo al backend. Si falla devuelve el mensaje de error
  // (y lo muestra arriba de la página, salvo que el formulario prefiera mostrarlo él); si sale bien devuelve null.
  const intentar = async (accion, mostrarError = true) => {
    try {
      setError(null)
      await accion()
      return null
    } catch (falla) {
      if (mostrarError) {
        setError(falla.message)
      }
      return falla.message
    }
  }

  // Cambia una parte de los datos de la sesión, por ejemplo guardar({ favoritos: [...] })
  const guardar = (cambios) => {
    setDatos((actuales) => ({ ...actuales, ...cambios }))
  }

  // ---------- Volver a pedir datos después de un cambio ----------

  const recargarAnimales = async () => {
    const [activos, pausados] = await Promise.all([
      animalesApi.traerAnimales(),
      esAdmin || (esRefugio && usuario.idRefugio) ? animalesApi.traerAnimales('PAUSADA') : [],
    ])
    setAnimales(activos)
    guardar({ pausados })
  }

  const recargarApadrinamientos = async () => {
    guardar({ apadrinamientos: await apadrinarApi.traerApadrinamientos(planes) })
  }

  const recargarUsuarios = async () => {
    guardar({ usuarios: await usuariosApi.traerUsuarios() })
  }

  // ---------- Sesión ----------

  // Deja logueado a "quien" y trae sus datos. Si antes de entrar había elegido un animal
  // para apadrinar, se lo agrega al muelle y lo lleva ahí.
  const entrar = async (quien) => {
    const nuevos = await traerDatosDe(quien, planes)
    const puede = quien.rol !== 'administrador' && quien.rol !== 'refugio'

    if (pendiente && puede) {
      await ponerEnElMuelle(nuevos.muelle, pendiente.animal, pendiente.plan)
      nuevos.muelle = await apadrinarApi.traerMuelle(planes)
      navigate('/muelle')
    }
    setPendiente(null)
    setDatos(nuevos)
    setUsuario(quien)
  }

  // Los dos devuelven el mensaje de error (para que lo muestre el formulario), o null si salió bien
  const ingresar = (nombreUsuario, contrasenia) =>
    intentar(async () => entrar(await usuariosApi.ingresar(nombreUsuario, contrasenia)), false)

  // Un padrino entra directo. Un refugio queda pendiente hasta que un administrador lo apruebe.
  const registrar = (datosDelFormulario, esUnRefugio) =>
    intentar(async () => entrar(await usuariosApi.registrar(datosDelFormulario, esUnRefugio)), false)

  const salir = () => {
    usuariosApi.salir()
    setUsuario(null)
    setDatos(SIN_SESION)
    setConBotiquin(false)
    setUltimoZarpar(null)
    irA('/')
  }

  // ---------- Mi cuenta ----------

  // Las dos devuelven el mensaje de error (para que lo muestre el formulario), o null si salió bien
  const guardarPerfil = (perfil) =>
    intentar(async () => {
      setUsuario(await usuariosApi.modificarMiPerfil(perfil))
    }, false)

  const cambiarContrasenia = (actual, nueva) => intentar(() => usuariosApi.cambiarMiContrasenia(actual, nueva), false)

  // ---------- Favoritos y muelle ----------

  // Los favoritos se guardan en la cuenta: si no hay nadie logueado, primero hay que entrar
  const alternarFavorito = (idAnimal) => {
    if (!usuario) {
      irA('/panel')
      return
    }
    intentar(async () => {
      if (datos.favoritos.includes(idAnimal)) {
        await apadrinarApi.quitarFavorito(idAnimal)
        guardar({ favoritos: datos.favoritos.filter((id) => id !== idAnimal) })
      } else {
        await apadrinarApi.agregarFavorito(idAnimal)
        guardar({ favoritos: [...datos.favoritos, idAnimal] })
      }
    })
  }

  // Si el animal ya estaba en el muelle, solo se le cambia el plan (conserva los cupos elegidos)
  const ponerEnElMuelle = async (muelle, animal, plan) => {
    const yaEstaba = muelle.items.find((item) => item.animal.id === animal.id)
    if (yaEstaba) {
      await apadrinarApi.cambiarItem(muelle.id, animal.id, yaEstaba.cantidad, plan.codigo)
    } else {
      await apadrinarApi.agregarAlMuelle(muelle.id, animal.id, plan.codigo)
    }
  }

  // El muelle es de cada usuario: quien no entró primero pasa por el login, y el animal
  // elegido queda esperando en "pendiente" hasta que entre
  const agregarAlMuelle = (animal, plan) => {
    if (!usuario) {
      setPendiente({ animal, plan })
      irA('/panel')
      return
    }
    intentar(async () => {
      await ponerEnElMuelle(datos.muelle, animal, plan)
      guardar({ muelle: await apadrinarApi.traerMuelle(planes) })
      setUltimoZarpar(null) // empieza un pedido nuevo: la página de gracias del anterior ya no hace falta
      irA('/muelle')
    })
  }

  // Botones de más y menos: la cantidad son los cupos que se quieren tomar de ese animal.
  // Va de 1 hasta los cupos que le quedan disponibles (igual que valida el backend).
  const cambiarCantidad = (idAnimal, cantidad) => {
    const item = datos.muelle.items.find((i) => i.animal.id === idAnimal)
    const acotada = Math.min(item.animal.cuposDisponibles, Math.max(1, cantidad))
    intentar(async () => {
      await apadrinarApi.cambiarItem(datos.muelle.id, idAnimal, acotada)
      guardar({ muelle: { ...datos.muelle, items: datos.muelle.items.map((i) => (i.animal.id === idAnimal ? { ...i, cantidad: acotada } : i)) } })
    })
  }

  const quitarDelMuelle = (idAnimal) => {
    intentar(async () => {
      await apadrinarApi.quitarDelMuelle(datos.muelle.id, idAnimal)
      guardar({ muelle: { ...datos.muelle, items: datos.muelle.items.filter((i) => i.animal.id !== idAnimal) } })
    })
  }

  // Zarpar = confirmar el muelle. Se llama cuando el pago salió bien. El backend vuelve a validar los cupos,
  // convierte cada item en un apadrinamiento del usuario, descuenta los cupos y deja el muelle vacío.
  // Devuelve el mensaje de error (por ejemplo, si a un animal ya no le quedan cupos), o null si salió bien.
  const zarpar = () =>
    intentar(async () => {
      const pago = await apadrinarApi.zarpar(datos.muelle.id, conBotiquin)

      // Después de pagar cambió casi todo: los apadrinamientos, los cupos de los animales y el muelle (hay uno nuevo)
      const [apadrinamientos, muelle, activos] = await Promise.all([
        apadrinarApi.traerApadrinamientos(planes),
        apadrinarApi.traerMuelle(planes),
        animalesApi.traerAnimales(),
      ])
      guardar({ apadrinamientos, muelle })
      setAnimales(activos)

      const apadrinados = apadrinamientos.filter((a) => a.activo && pago.idsAnimales.includes(a.animal.id))
      setUltimoZarpar({ apadrinados, total: pago.total })
      setConBotiquin(false)
      irA('/gracias')
    }, false)

  // ---------- Apadrinamientos del padrino ----------

  const cambiarPlan = (idApadrinamiento, plan) => {
    intentar(async () => {
      const cambiado = await apadrinarApi.cambiarPlan(idApadrinamiento, plan.codigo, planes)
      guardar({ apadrinamientos: datos.apadrinamientos.map((a) => (a.id === idApadrinamiento ? cambiado : a)) })
    })
  }

  // No se borra: queda inactivo, así el historial no se pierde.
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelarApadrinamiento = (idApadrinamiento) => {
    intentar(async () => {
      await apadrinarApi.cancelarApadrinamiento(idApadrinamiento)
      await Promise.all([recargarApadrinamientos(), recargarAnimales()])
      irA('/panel')
    })
  }

  // ---------- Usuarios (administrador) ----------

  const usuarioLlamado = (nombreUsuario) => datos.usuarios.find((u) => u.nombreUsuario === nombreUsuario)

  // Si el administrador convierte a alguien en refugio, el backend le crea el refugio ya aprobado
  const cambiarRol = (nombreUsuario, rol) => {
    intentar(async () => {
      const idRol = datos.roles.find((r) => r.nombre === rol).id
      await usuariosApi.cambiarRol(usuarioLlamado(nombreUsuario).id, idRol)
      await recargarUsuarios()
    })
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja.
  // Al dar de baja a un refugio sus publicaciones se pausan, por eso también se vuelven a pedir los animales.
  const cambiarActivo = (nombreUsuario) => {
    intentar(async () => {
      const elegido = usuarioLlamado(nombreUsuario)
      if (elegido.activo) {
        await usuariosApi.darDeBaja(elegido.id)
      } else {
        await usuariosApi.reactivar(elegido.id)
      }
      await Promise.all([recargarUsuarios(), recargarAnimales()])
    })
  }

  const aprobarRefugio = (nombreUsuario) => {
    intentar(async () => {
      await usuariosApi.aprobarRefugio(usuarioLlamado(nombreUsuario).idRefugio)
      await recargarUsuarios()
    })
  }

  // ---------- Categorías, roles y permisos (administrador) ----------
  // Todas devuelven el mensaje de error, o null si salió bien

  const crearCategoria = (nombre, descripcion) =>
    intentar(async () => {
      await animalesApi.crearCategoria(nombre, descripcion)
      setCategorias(await animalesApi.traerCategorias())
    }, false)

  const recargarRoles = async () => {
    const [roles, permisos] = await Promise.all([usuariosApi.traerRoles(), usuariosApi.traerPermisos()])
    guardar({ roles, permisos })
  }

  const crearRol = (nombre) =>
    intentar(async () => {
      await usuariosApi.crearRol(nombre)
      await recargarRoles()
    })

  const crearPermiso = (nombre, descripcion) =>
    intentar(async () => {
      await usuariosApi.crearPermiso(nombre, descripcion)
      await recargarRoles()
    })

  // Reemplaza todos los permisos del rol por los elegidos
  const asignarPermisos = (idRol, idsPermisos) =>
    intentar(async () => {
      await usuariosApi.asignarPermisos(idRol, idsPermisos)
      await recargarRoles()
    })

  // ---------- Animales (refugio y admin) ----------

  // Publica un animal y después le sube las fotos elegidas, una por una.
  // Devuelve el mensaje de error (para que lo muestre el formulario), o null si salió bien.
  const agregarAnimal = (datosDelFormulario, fotos) =>
    intentar(async () => {
      const nuevo = await animalesApi.crearAnimal(datosDelFormulario)
      for (const foto of fotos) {
        await animalesApi.subirFoto(nuevo.id, foto)
      }
      await recargarAnimales()
    }, false)

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitarAnimal = (idAnimal) => {
    intentar(async () => {
      await animalesApi.quitarAnimal(idAnimal)
      await recargarAnimales()
    })
  }

  // "cambios" trae solo lo que se modifica, y cada cosa va a su propio endpoint:
  // { descuento: { porcentaje, hasta } } pone una oferta y { descuento: null } la quita,
  // { fotos: [...] } sube las fotos nuevas y { publicacion: 'PAUSADA' | 'ACTIVA' } pausa o republica.
  const editarAnimal = (idAnimal, cambios) => {
    intentar(async () => {
      const animal = todosLosAnimales.find((a) => a.id === idAnimal)

      if (cambios.descuento) {
        await animalesApi.ponerOferta(idAnimal, cambios.descuento.porcentaje, cambios.descuento.hasta)
      }
      if (cambios.descuento === null && animal.descuento) {
        await animalesApi.quitarOferta(idAnimal, animal.descuento.id)
      }
      if (cambios.fotos) {
        // Las que ya tenía son direcciones (urls); las recién elegidas vienen como texto "data:"
        for (const foto of cambios.fotos.filter((f) => f.startsWith('data:'))) {
          await animalesApi.subirFoto(idAnimal, foto)
        }
      }
      if (cambios.publicacion) {
        await animalesApi.cambiarPublicacion(idAnimal, cambios.publicacion)
      }
      await recargarAnimales()
    })
  }

  // Las dos devuelven el mensaje de error, o null si salió bien
  const publicarNovedad = (idAnimal, texto) => intentar(() => animalesApi.publicarNovedad(idAnimal, texto))

  const registrarUbicacion = (idAnimal, latitud, longitud) => intentar(() => animalesApi.registrarUbicacion(idAnimal, latitud, longitud))

  // ---------- Páginas que dependen de quién está logueado ----------

  const login = <Login onIngresar={ingresar} onRegistrar={registrar} />

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

  // Para zarpar hace falta tener algo en el muelle y haber entrado
  const elegirPaginaZarpar = () => {
    if (!usuario) {
      return login
    }
    // Con el muelle vacío no hay nada que pagar. Justo después de zarpar también queda vacío:
    // en ese caso se pasa a la página de gracias de ese pago.
    if (datos.muelle.items.length === 0) {
      return <Navigate to={ultimoZarpar ? '/gracias' : '/muelle'} replace />
    }
    return <Zarpar muelle={datos.muelle.items} conBotiquin={conBotiquin} onConfirmar={zarpar} onVolver={() => irA('/muelle')} />
  }

  return (
    // ContextoMoneda comparte la moneda elegida con todos los componentes que muestran precios,
    // y ContextoPlanes los niveles de apadrinamiento con los que arman los planes de un animal
    <ContextoMoneda.Provider value={moneda}>
      <ContextoPlanes.Provider value={planes}>
        {/* flex + min-h-screen + flex-1 en <main>: el footer queda siempre abajo, aunque la página sea corta */}
        <div ref={refArriba} className="min-h-screen flex flex-col fondo-playa font-body-md text-on-surface">
          <Header
            rutaActual={pathname}
            cantidadMuelle={datos.muelle.items.length}
            usuario={usuario}
            moneda={moneda}
            onCambiarMoneda={setMoneda}
            onNavegar={irA}
            onSalir={salir}
          />

          <main className="flex-1">
            {/* El último pedido al backend que falló, con su mensaje */}
            {error && (
              <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pb-space-sm print:hidden">
                <div role="alert" className="bg-error-container text-on-error-container rounded-2xl px-space-lg py-space-md flex items-center justify-between gap-space-md shadow-sm">
                  <span className="inline-flex items-center gap-space-sm font-body-md text-body-md">
                    <Icono nombre="error" clase="text-[20px]" /> {error}
                  </span>
                  <button onClick={() => setError(null)} className="font-label-lg text-label-lg underline">
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {cargando ? (
              <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-xl">Cargando SeaPlace…</p>
            ) : (
              <Routes>
                <Route path="/" element={<Inicio animales={animales} onVerCatalogo={() => irA('/catalogo')} onVerAnimal={verAnimal} />} />
                <Route
                  path="/catalogo"
                  element={<Catalogo animales={animales} categorias={categorias} favoritos={datos.favoritos} onFavorito={alternarFavorito} onVerAnimal={verAnimal} />}
                />
                <Route
                  path="/animal/:id"
                  element={
                    <Detalle
                      animales={todosLosAnimales}
                      favoritos={datos.favoritos}
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
                        muelle={datos.muelle.items}
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
                      <Gracias
                        zarpar={ultimoZarpar}
                        onVerCertificado={(item) => irA(`/panel/${item.animal.id}/certificado`)}
                        onVerPanel={() => irA('/panel')}
                        onVerCatalogo={() => irA('/catalogo')}
                      />
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
                      onVolver={() => irA('/panel')}
                      onCambiarPlan={cambiarPlan}
                      onCancelar={cancelarApadrinamiento}
                      onVerCertificado={(item) => irA(`/panel/${item.animal.id}/certificado`)}
                    />
                  }
                />
                <Route path="/panel/:id/certificado" element={<Certificado usuario={usuario} apadrinados={misApadrinados} onVolver={verApadrinado} />} />

                {/* "Mi cuenta" es para cualquiera que haya entrado: si no hay nadie, se muestra el login */}
                <Route
                  path="/cuenta"
                  element={usuario ? <Cuenta usuario={usuario} onGuardarPerfil={guardarPerfil} onCambiarContrasenia={cambiarContrasenia} /> : login}
                />

                {/* Solo entra un administrador: el resto va al panel (o al login) */}
                <Route
                  path="/admin"
                  element={
                    esAdmin ? (
                      <Admin
                        usuario={usuario}
                        usuarios={datos.usuarios}
                        roles={datos.roles}
                        permisos={datos.permisos}
                        categorias={categorias}
                        animales={todosLosAnimales}
                        apadrinamientos={datos.apadrinamientos}
                        onCambiarRol={cambiarRol}
                        onCambiarActivo={cambiarActivo}
                        onAprobar={aprobarRefugio}
                        onVerAnimal={verAnimal}
                        onQuitarAnimal={quitarAnimal}
                        onCrearCategoria={crearCategoria}
                        onCrearRol={crearRol}
                        onCrearPermiso={crearPermiso}
                        onAsignarPermisos={asignarPermisos}
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
                        apadrinamientos={datos.apadrinamientos}
                        onAgregar={agregarAnimal}
                        onQuitar={quitarAnimal}
                        onEditarAnimal={editarAnimal}
                        onPublicarNovedad={publicarNovedad}
                        onRegistrarUbicacion={registrarUbicacion}
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
            )}
          </main>

          <Footer />
        </div>
      </ContextoPlanes.Provider>
    </ContextoMoneda.Provider>
  )
}

export default App
