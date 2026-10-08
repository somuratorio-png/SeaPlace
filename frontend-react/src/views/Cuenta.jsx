import { useState } from 'react'
import Portada from '../components/comunes/Portada'
import CampoTexto from '../components/login/CampoTexto'

const claseTarjeta = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container disabled:opacity-60'
const claseError = 'bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm'
const claseExito = 'font-label-lg text-label-lg text-secondary'

const sinContrasenias = { actual: '', nueva: '', repetida: '' }

// "Mi cuenta": el usuario logueado cambia sus datos y su contraseña.
// El nombre de usuario no se puede cambiar (es el que lleva el token), y el rol tampoco.
// onGuardarPerfil y onCambiarContrasenia le piden el cambio al backend y devuelven su mensaje
// de error, o null si salió bien.
const Cuenta = ({ usuario, onGuardarPerfil, onCambiarContrasenia }) => {
  const [perfil, setPerfil] = useState({ nombre: usuario.nombre, apellido: usuario.apellido, mail: usuario.mail })
  const [errorPerfil, setErrorPerfil] = useState(null)
  const [perfilGuardado, setPerfilGuardado] = useState(false)

  const [contrasenias, setContrasenias] = useState(sinContrasenias)
  const [errorContrasenia, setErrorContrasenia] = useState(null)
  const [contraseniaCambiada, setContraseniaCambiada] = useState(false)

  const cambiarPerfil = (evento) => {
    setPerfil({ ...perfil, [evento.target.name]: evento.target.value })
    setPerfilGuardado(false)
  }

  const cambiarContrasenias = (evento) => {
    setContrasenias({ ...contrasenias, [evento.target.name]: evento.target.value })
    setContraseniaCambiada(false)
  }

  const guardarPerfil = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mensaje = await onGuardarPerfil(perfil)
    setErrorPerfil(mensaje)
    setPerfilGuardado(mensaje === null)
  }

  const guardarContrasenia = async (evento) => {
    evento.preventDefault()
    if (contrasenias.nueva.length < 8) {
      setErrorContrasenia('La contraseña nueva debe tener al menos 8 caracteres')
      return
    }
    if (contrasenias.nueva !== contrasenias.repetida) {
      setErrorContrasenia('Las dos contraseñas nuevas no coinciden')
      return
    }
    const mensaje = await onCambiarContrasenia(contrasenias.actual, contrasenias.nueva)
    setErrorContrasenia(mensaje)
    setContraseniaCambiada(mensaje === null)
    if (mensaje === null) {
      setContrasenias(sinContrasenias)
    }
  }

  return (
    <>
      <Portada icono="manage_accounts" etiqueta="Mi cuenta" titulo={`${usuario.nombre} ${usuario.apellido}`} texto={`Usuario @${usuario.nombreUsuario} · cuenta de ${usuario.rol}`} />

      <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
        <form onSubmit={guardarPerfil} className={claseTarjeta}>
          <h2 className="font-headline-sm text-headline-sm text-primary">Mis datos</h2>
          <CampoTexto etiqueta="Nombre" nombre="nombre" valor={perfil.nombre} onCambiar={cambiarPerfil} />
          <CampoTexto etiqueta="Apellido" nombre="apellido" valor={perfil.apellido} onCambiar={cambiarPerfil} />
          <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={perfil.mail} onCambiar={cambiarPerfil} />

          {errorPerfil && <p className={claseError}>{errorPerfil}</p>}
          <div className="flex flex-wrap items-center gap-space-md">
            <button type="submit" className={claseBoton}>
              Guardar cambios
            </button>
            {perfilGuardado && <span className={claseExito}>¡Datos guardados!</span>}
          </div>
        </form>

        <form onSubmit={guardarContrasenia} className={claseTarjeta}>
          <h2 className="font-headline-sm text-headline-sm text-primary">Cambiar contraseña</h2>
          <CampoTexto etiqueta="Contraseña actual" nombre="actual" tipo="password" valor={contrasenias.actual} onCambiar={cambiarContrasenias} />
          <CampoTexto etiqueta="Contraseña nueva" nombre="nueva" tipo="password" valor={contrasenias.nueva} onCambiar={cambiarContrasenias} />
          <CampoTexto etiqueta="Repetí la contraseña nueva" nombre="repetida" tipo="password" valor={contrasenias.repetida} onCambiar={cambiarContrasenias} />

          {errorContrasenia && <p className={claseError}>{errorContrasenia}</p>}
          <div className="flex flex-wrap items-center gap-space-md">
            <button type="submit" className={claseBoton}>
              Cambiar contraseña
            </button>
            {contraseniaCambiada && <span className={claseExito}>¡Contraseña cambiada!</span>}
          </div>
        </form>
      </div>
    </>
  )
}

export default Cuenta
