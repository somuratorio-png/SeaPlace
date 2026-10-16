import { useState } from 'react'
import Portada from '../comunes/Portada'
import CampoTexto from '../comunes/CampoTexto'
import { cambiarMiContrasenia, modificarMiPerfil } from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { useSesion } from '../../hooks/useSesion'
import { useFormulario } from '../../hooks/useFormulario'
import MensajeError from '../comunes/MensajeError'
import { validarContrasenia } from '../../utils/validaciones'

const claseTarjeta = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container disabled:opacity-60'
const claseExito = 'font-label-lg text-label-lg text-secondary'

const sinContrasenias = { actual: '', nueva: '', repetida: '' }

// "Mi cuenta": el usuario logueado cambia sus datos y su contraseña.
// El nombre de usuario no se puede cambiar (es el que lleva el token), y el rol tampoco.
// Los dos formularios le piden el cambio al backend y muestran acá mismo su mensaje de error.
// guardarPerfil (de useSesion) actualiza el usuario en toda la página
const PanelCuenta = () => {
  const { usuario, guardarPerfil } = useSesion()
  const { datos: perfil, cambiar: cambiarCampoPerfil } = useFormulario({ nombre: usuario.nombre, apellido: usuario.apellido, mail: usuario.mail })
  const [errorPerfil, setErrorPerfil] = useState(null)
  const [perfilGuardado, setPerfilGuardado] = useState(false)

  const { datos: contrasenias, cambiar: cambiarCampoContrasenia, reiniciar: reiniciarContrasenias } = useFormulario(sinContrasenias)
  const [errorContrasenia, setErrorContrasenia] = useState(null)
  const [contraseniaCambiada, setContraseniaCambiada] = useState(false)

  const cambiarPerfil = (evento) => {
    cambiarCampoPerfil(evento)
    setPerfilGuardado(false)
  }

  const cambiarContrasenias = (evento) => {
    cambiarCampoContrasenia(evento)
    setContraseniaCambiada(false)
  }

  const handleGuardarPerfil = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    intentar(modificarMiPerfil({ nombre: perfil.nombre.trim(), apellido: perfil.apellido.trim(), mail: perfil.mail.trim() }).then(guardarPerfil)).then((mensaje) => {
      setErrorPerfil(mensaje)
      setPerfilGuardado(mensaje === null)
    })
  }

  const guardarContrasenia = (evento) => {
    evento.preventDefault()
    const errorClave = validarContrasenia(contrasenias.nueva, 'La contraseña nueva')
    if (errorClave !== null) {
      setErrorContrasenia(errorClave)
      return
    }
    if (contrasenias.nueva !== contrasenias.repetida) {
      setErrorContrasenia('Las dos contraseñas nuevas no coinciden')
      return
    }
    intentar(cambiarMiContrasenia(contrasenias.actual, contrasenias.nueva)).then((mensaje) => {
      setErrorContrasenia(mensaje)
      setContraseniaCambiada(mensaje === null)
      if (mensaje === null) {
        reiniciarContrasenias()
      }
    })
  }

  return (
    <>
      <Portada icono="manage_accounts" etiqueta="Mi cuenta" titulo={`${usuario.nombre} ${usuario.apellido}`} texto={`Usuario @${usuario.nombreUsuario} · cuenta de ${usuario.rol}`} />

      <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
        <form onSubmit={handleGuardarPerfil} className={claseTarjeta}>
          <h2 className="font-headline-sm text-headline-sm text-primary">Mis datos</h2>
          <CampoTexto etiqueta="Nombre" nombre="nombre" valor={perfil.nombre} onCambiar={cambiarPerfil} />
          <CampoTexto etiqueta="Apellido" nombre="apellido" valor={perfil.apellido} onCambiar={cambiarPerfil} />
          <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={perfil.mail} onCambiar={cambiarPerfil} />

          {errorPerfil && <MensajeError mensaje={errorPerfil} />}
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

          {errorContrasenia && <MensajeError mensaje={errorContrasenia} />} 

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

export default PanelCuenta
