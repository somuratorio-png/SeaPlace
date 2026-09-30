import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { emblema, loginFondo } from '../data/imagenes'

const VACIO = { nombre: '', apellido: '', mail: '', nombreUsuario: '', contrasenia: '' }

const Login = () => {
  const { usuario, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Si el usuario llegó acá porque quiso entrar a una página protegida, después lo devolvemos ahí
  const destino = location.state?.desde ?? '/panel'

  const [modoRegistro, setModoRegistro] = useState(false)
  const [form, setForm] = useState(VACIO)
  const [verContrasenia, setVerContrasenia] = useState(false)
  const [recordar, setRecordar] = useState(true)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to={destino} replace />

  // Un solo handler para todos los inputs: usa el atributo name para saber qué campo cambió
  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cambiarModo = (registro) => {
    setModoRegistro(registro)
    setError(null)
  }

  const enviar = async (e) => {
    e.preventDefault() // evita que el navegador recargue la página (comportamiento por defecto de un <form>)
    setError(null)
    setEnviando(true)
    try {
      if (modoRegistro) {
        await register(form)
      } else {
        await login(form.nombreUsuario, form.contrasenia, recordar)
      }
      navigate(destino, { replace: true })
    } catch (err) {
      // err.message es el texto del error que lanza services/authService.js
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const tabActiva = 'bg-surface-container-lowest text-primary shadow-sm'
  const tabInactiva = 'text-outline hover:text-on-surface'

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-gutter bg-surface">
      <div className="w-full max-w-6xl mx-auto">
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
          {/* Lado izquierdo: imagen y frase */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-space-xl overflow-hidden min-h-[520px] lg:min-h-[720px] text-on-primary">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${loginFondo}")` }} role="img" aria-label="Foca descansando en la arena húmeda del Pacífico" />
            <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/60 to-primary/40 mix-blend-multiply" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-primary/80" />

            <Link to="/" className="relative z-10 flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest/90 p-2 shadow-sm flex items-center justify-center backdrop-blur-sm">
                <img alt="Emblema de SeaPlace" className="w-full h-full object-contain" src={emblema} />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-surface-container-lowest tracking-tight">SeaPlace</span>
                <span className="font-label-md uppercase tracking-wider text-secondary-fixed opacity-90">Custodia del Pacífico</span>
              </div>
            </Link>

            <div className="relative z-10 my-auto py-space-lg">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest mb-space-md">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
                <span className="font-label-md">Santuario Isla Monterey • Marea Viva</span>
              </div>
              <blockquote className="font-headline-md text-surface-container-lowest leading-relaxed mb-space-md font-medium">
                "Proteger a nuestras focas gorditas y sanas en las orillas del Pacífico es custodiar el latido vivo del océano."
              </blockquote>
              <p className="font-body-sm text-surface-container-high opacity-90 flex items-center gap-space-xs">
                <Icon name="water_drop" className="text-sm" />
                Red Comunitaria de Protectores y Biólogos Marinos
              </p>
            </div>

            <div className="relative z-10 bg-surface-container-lowest/15 backdrop-blur-md rounded-lg p-space-md flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-surface-container-lowest">
                <Icon name="pets" />
              </div>
              <div>
                <p className="font-label-md text-surface-container-lowest leading-none">1,420+ Ejemplares</p>
                <p className="font-body-sm text-secondary-fixed text-xs mt-0.5">Focas gorditas y protegidas con telemetría activa</p>
              </div>
            </div>
          </div>

          {/* Lado derecho: formulario */}
          <div className="lg:col-span-7 p-space-lg sm:p-space-xl lg:p-margin flex flex-col justify-center bg-surface-container-lowest">
            <div className="flex items-center p-1 bg-surface-container-low rounded-lg mb-space-lg max-w-sm" role="tablist">
              <button type="button" role="tab" aria-selected={!modoRegistro} onClick={() => cambiarModo(false)} className={`flex-1 py-2 px-space-md text-center rounded-md font-label-lg transition-all duration-200 ${modoRegistro ? tabInactiva : tabActiva}`}>
                Iniciar Sesión
              </button>
              <button type="button" role="tab" aria-selected={modoRegistro} onClick={() => cambiarModo(true)} className={`flex-1 py-2 px-space-md text-center rounded-md font-label-lg transition-all duration-200 ${modoRegistro ? tabActiva : tabInactiva}`}>
                Crear Cuenta
              </button>
            </div>

            <div className="mb-space-lg">
              <h1 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface mb-space-xs">
                {modoRegistro ? 'Únete a la Alianza del Pacífico' : '¡Hola de nuevo, guardián del mar!'}
              </h1>
              <p className="font-body-md text-on-surface-variant">
                {modoRegistro
                  ? 'Crea tu carnet de protector y adopta una huella marina hoy mismo.'
                  : 'Accede a tu bitácora de protección y consulta la telemetría de tus ahijados marinos.'}
              </p>
            </div>

            <form className="space-y-space-md" onSubmit={enviar}>
              {/* Campos extra que solo se piden al crear cuenta */}
              {modoRegistro && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <CampoTexto label="Nombre" name="nombre" icon="badge" placeholder="Ej. Marina" value={form.nombre} onChange={cambiar} autoComplete="given-name" />
                    <CampoTexto label="Apellido" name="apellido" icon="badge" placeholder="Ej. Delgado" value={form.apellido} onChange={cambiar} autoComplete="family-name" />
                  </div>
                  <CampoTexto label="Correo Electrónico" name="mail" type="email" icon="mail" placeholder="guardian@costapacifico.org" value={form.mail} onChange={cambiar} autoComplete="email" />
                </>
              )}

              {/* Se entra con nombre de usuario (no con mail), igual que en el backend del TP */}
              <CampoTexto label="Nombre de Usuario" name="nombreUsuario" icon="person" placeholder="marina.delgado" value={form.nombreUsuario} onChange={cambiar} autoComplete="username" />

              <div className="flex flex-col gap-1.5">
                <label className="font-label-lg text-on-surface" htmlFor="contrasenia">Contraseña</label>
                <div className="relative flex items-center">
                  <Icon name="lock" className="absolute left-3.5 text-outline text-lg pointer-events-none" />
                  <input
                    id="contrasenia"
                    name="contrasenia"
                    type={verContrasenia ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.contrasenia}
                    onChange={cambiar}
                    autoComplete={modoRegistro ? 'new-password' : 'current-password'}
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg pl-10 pr-11 py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setVerContrasenia(!verContrasenia)}
                    aria-label={verContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3.5 text-outline hover:text-on-surface transition-colors p-1"
                  >
                    <Icon name={verContrasenia ? 'visibility_off' : 'visibility'} className="text-lg" />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-secondary"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  required={modoRegistro}
                />
                <span className="font-body-sm text-on-surface-variant">
                  {modoRegistro ? 'Acepto el Manifiesto de Protección y Términos' : 'Mantener mi sesión abierta en este equipo'}
                </span>
              </label>

              {!modoRegistro && (
                <p className="font-body-sm text-body-sm text-on-surface-variant bg-tertiary-fixed/30 rounded-lg px-space-md py-space-sm flex items-center gap-2">
                  <Icon name="info" className="text-tertiary text-[18px]" />
                  Demo: entrá con el usuario <b>marina</b> y la contraseña <b>foquita123</b>, o creá una cuenta.
                </p>
              )}

              {error && (
                <p className="font-body-sm text-body-sm text-on-error-container bg-error-container rounded-lg px-space-md py-space-sm flex items-center gap-2" role="alert">
                  <Icon name="error" className="text-[18px]" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3.5 px-space-lg rounded-lg bg-primary hover:bg-primary-container disabled:opacity-70 text-on-primary font-headline-sm text-center shadow-md transition-all duration-200 flex items-center justify-center gap-space-sm mt-space-md"
              >
                {enviando ? (
                  <Icon name="progress_activity" className="animate-spin text-lg" />
                ) : (
                  <>
                    <span>{modoRegistro ? 'Completar mi Registro de Protector' : 'Entrar a mi Panel de Protector'}</span>
                    <Icon name={modoRegistro ? 'check_circle' : 'arrow_forward'} className="text-lg" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-space-lg bg-surface-container-low/60 rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
              <div className="flex items-center gap-space-sm">
                <Icon name="sailing" className="text-secondary text-2xl" />
                <span className="font-body-sm text-on-surface">¿Aún no eres protector?</span>
              </div>
              <Link className="font-label-lg text-secondary hover:underline inline-flex items-center gap-1" to="/catalogo">
                Explorar animales para apadrinar →
              </Link>
            </div>

            <div className="mt-space-lg">
              <span className="font-label-md text-outline uppercase tracking-wider block mb-space-sm">Beneficios de la Comunidad Salada</span>
              <div className="grid grid-cols-3 gap-space-sm">
                <Beneficio icon="satellite_alt" color="text-secondary" titulo="Telemetría GPS" texto="Rastreo en vivo" />
                <Beneficio icon="clinical_notes" color="text-primary" titulo="Salud Marina" texto="Partes médicos" />
                <Beneficio icon="badge" color="text-tertiary" titulo="Carnet Digital" texto="Pertenencia activa" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const CampoTexto = ({ label, name, icon, type = 'text', ...resto }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-lg text-on-surface" htmlFor={name}>{label}</label>
      <div className="relative flex items-center">
        <Icon name={icon} className="absolute left-3.5 text-outline text-lg pointer-events-none" />
        <input
          id={name}
          name={name}
          type={type}
          required
          {...resto}
          className="w-full bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg pl-10 pr-space-md py-3 font-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
        />
      </div>
    </div>
  )
}

const Beneficio = ({ icon, color, titulo, texto }) => {
  return (
    <div className="flex flex-col items-center text-center p-space-sm bg-surface-container-low rounded-lg">
      <Icon name={icon} className={`${color} mb-1 text-xl`} />
      <span className="font-label-md text-on-surface leading-tight">{titulo}</span>
      <span className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{texto}</span>
    </div>
  )
}

export default Login
