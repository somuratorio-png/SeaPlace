import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Footer from './components/comunes/Footer'
import Header from './components/comunes/Header'
import { ContextoMoneda } from './contexto/Moneda'
import { animalesDeDemo } from './data/animales'
import { apadrinamientosDeDemo, novedadesDeDemo } from './data/apadrinamientos'
import { usuariosDeDemo } from './data/usuarios'
import { useEstadoGuardado } from './hooks/useEstadoGuardado'
import { hoy } from './utils/fechas'
import { totalMuelle } from './utils/precios'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Muelle from './views/Muelle'
import Catalogo from './views/Catalogo'
import Certificado from './views/Certificado'
import Detalle from './views/Detalle'
import Gracias from './views/Gracias'
import Inicio from './views/Inicio'
import Login from './views/Login'
import NoEncontrada from './views/NoEncontrada'
import Zarpar from './views/Zarpar'
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
  const [muelle, setMuelle] = useEstadoGuardado('muelle', []) // [{ animal, plan, cantidad }] cantidad = cupos que se toman
  const [favoritos, setFavoritos] = useEstadoGuardado('favoritos', []) // ids de animales
  const [sesion, setSesion] = useEstadoGuardado('sesion', null) // nombre de usuario de quien entró, o null
  const [moneda, setMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'
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

  // El muelle con los datos más nuevos de cada animal (sobre todo, cuántos cupos le quedan).
  // Si a un animal le quedan menos cupos que los pedidos, la cantidad se ajusta; si no le queda ninguno, sale del muelle.
  const muelleActual = muelle
    .map((item) => ({ ...item, animal: animales.find((animal) => animal.id === item.animal.id) ?? item.animal }))
    .filter((item) => item.animal.cuposDisponibles > 0)
    .map((item) => ({ ...item, cantidad: Math.min(item.cantidad, item.animal.cuposDisponibles) }))

  const irA = (ruta) => {
    navigate(ruta)
  }

  const verAnimal = (animal) => {
    irA(`/animal/${animal.id}`)
  }

  const verApadrinado = (item) => {
    irA(`/panel/${item.animal.id}`)
  }

  // ---------- Favoritos y muelle ----------

  const alternarFavorito = (idAnimal) => {
    if (favoritos.includes(idAnimal)) {
      setFavoritos(favoritos.filter((id) => id !== idAnimal))
    } else {
      setFavoritos([...favoritos, idAnimal])
    }
  }

  // Si el animal ya estaba en el muelle, se reemplaza (por si cambió de plan)
  const agregarAlMuelle = (animal, plan) => {
    const sinEseAnimal = muelle.filter((item) => item.animal.id !== animal.id)
    setMuelle([...sinEseAnimal, { animal, plan, cantidad: 1 }])
    irA('/muelle')
  }

  // Botones de más y menos: la cantidad son los cupos que se quieren tomar de ese animal.
  // Va de 1 hasta los cupos que le quedan disponibles (igual que valida el backend).
  const cambiarCantidad = (idAnimal, cantidad) => {
    const animal = animales.find((a) => a.id === idAnimal)
    const acotada = Math.min(animal.cuposDisponibles, Math.max(1, cantidad))
    setMuelle(muelle.map((item) => (item.animal.id === idAnimal ? { ...item, cantidad: acotada } : item)))
  }

  const quitarDelMuelle = (idAnimal) => {
    setMuelle(muelle.filter((item) => item.animal.id !== idAnimal))
  }

  // Zarpar = confirmar el muelle. Se llama cuando el pago salió bien. Cada item del muelle pasa a ser
  // un apadrinamiento del usuario, se descuentan los cupos que tomó de cada animal y el muelle se vacía.
  const zarpar = () => {
    // El apadrinamiento activo que el usuario ya tenía de ese animal, si tenía alguno
    const anteriorDe = (item) => apadrinamientos.find((a) => a.usuario === usuario.nombreUsuario && a.activo && a.animal.id === item.animal.id)

    // Si ya lo apadrinaba, se le suman los cupos nuevos al que tenía; si no, se crea uno
    const resultado = muelleActual.map((item) => {
      const anterior = anteriorDe(item)
      const pago = { fecha: hoy(), monto: item.plan.precio * item.cantidad }
      if (anterior) {
        return { ...anterior, plan: item.plan, cupos: anterior.cupos + item.cantidad, pagos: [...anterior.pagos, pago] }
      }
      return {
        id: crypto.randomUUID(),
        usuario: usuario.nombreUsuario,
        animal: item.animal,
        plan: item.plan,
        cupos: item.cantidad,
        desde: hoy(),
        activo: true,
        pagos: [pago],
      }
    })
    const reemplazados = resultado.map((a) => a.id)

    setApadrinamientos([...apadrinamientos.filter((a) => !reemplazados.includes(a.id)), ...resultado])

    // Cada animal pierde tantos cupos disponibles como se tomaron
    const cuposTomados = (animal) => muelleActual.filter((item) => item.animal.id === animal.id).reduce((suma, item) => suma + item.cantidad, 0)
    setAnimales(animales.map((animal) => ({ ...animal, cuposDisponibles: animal.cuposDisponibles - cuposTomados(animal) })))

    setUltimoZarpar({ apadrinados: resultado, total: totalMuelle(muelleActual, conBotiquin) })
    setMuelle([])
    setConBotiquin(false)
    irA('/gracias')
  }

  // ---------- Apadrinamientos del padrino ----------

  const cambiarPlan = (idApadrinamiento, plan) => {
    setApadrinamientos(apadrinamientos.map((a) => (a.id === idApadrinamiento ? { ...a, plan } : a)))
  }

  // No se borra: queda inactivo, así el historial no se pierde
  // Al cancelar, los cupos que tenía tomados vuelven a quedar disponibles para ese animal.
  const cancelarApadrinamiento = (idApadrinamiento) => {
    const cancelado = apadrinamientos.find((a) => a.id === idApadrinamiento)
    setApadrinamientos(apadrinamientos.map((a) => (a.id === idApadrinamiento ? { ...a, activo: false } : a)))
    setAnimales(
      animales.map((animal) => (animal.id === cancelado.animal.id ? { ...animal, cuposDisponibles: animal.cuposDisponibles + cancelado.cupos } : animal)),
    )
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

  // Para zarpar hace falta tener algo en el muelle y haber entrado
  const elegirPaginaZarpar = () => {
    if (muelleActual.length === 0) {
      return <Navigate to="/muelle" replace />
    }
    if (!usuario) {
      return login
    }
    return <Zarpar muelle={muelleActual} conBotiquin={conBotiquin} onConfirmar={zarpar} onVolver={() => irA('/muelle')} />
  }

  return (
    // ContextoMoneda comparte la moneda elegida con todos los componentes que muestran precios
    <ContextoMoneda.Provider value={moneda}>
      {/* flex + min-h-screen + flex-1 en <main>: el footer queda siempre abajo, aunque la página sea corta */}
      <div ref={refArriba} className="min-h-screen flex flex-col fondo-playa font-body-md text-on-surface">
        <Header
          rutaActual={pathname}
          cantidadMuelle={muelleActual.length}
          usuario={usuario}
          moneda={moneda}
          onCambiarMoneda={setMoneda}
          onNavegar={irA}
          onSalir={salir}
        />

        <main className="flex-1">
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
                    muelle={muelleActual}
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
