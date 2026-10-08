import { useState } from 'react'
import { pedirCodigo, restablecerContrasenia } from '../../services/usuarios'
import CampoTexto from './CampoTexto'

const claseBoton = 'brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-3 rounded-full hover:bg-tertiary-container'

// "Olvidé mi contraseña", en dos pasos:
// 1) se escribe el mail y el backend genera un código de un solo uso (vence a los 5 minutos);
// 2) con ese código se elige la contraseña nueva.
// El proyecto no manda correos de verdad: el código sale impreso en la consola del backend.
// onVolver vuelve al formulario de ingreso.
const RecuperarContrasenia = ({ onVolver }) => {
  const [paso, setPaso] = useState('mail') // 'mail' | 'codigo' | 'listo'
  const [datos, setDatos] = useState({ mail: '', codigo: '', contrasenia: '' })
  const [aviso, setAviso] = useState(null) // lo que contestó el backend al pedir el código
  const [error, setError] = useState(null)

  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  const pedir = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    try {
      setAviso(await pedirCodigo(datos.mail))
      setError(null)
      setPaso('codigo')
    } catch (falla) {
      setError(falla.message)
    }
  }

  const restablecer = async (evento) => {
    evento.preventDefault()
    if (datos.contrasenia.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    try {
      await restablecerContrasenia(datos.mail, datos.codigo.trim(), datos.contrasenia)
      setError(null)
      setPaso('listo')
    } catch (falla) {
      setError(falla.message)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md space-y-space-md">
      <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface">Recuperá tu contraseña</h1>

      {paso === 'mail' && (
        <form onSubmit={pedir} className="space-y-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">Escribí el correo de tu cuenta y te mandamos un código para elegir una contraseña nueva.</p>
          <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={datos.mail} onCambiar={cambiar} />
          {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}
          <button type="submit" className={claseBoton}>
            Pedir código
          </button>
        </form>
      )}

      {paso === 'codigo' && (
        <form onSubmit={restablecer} className="space-y-space-md">
          <p className="bg-secondary-container text-on-secondary-fixed-variant rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{aviso}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            El código vence a los 5 minutos. Como es una demo, no llega por correo: aparece en la consola del servidor.
          </p>
          <CampoTexto etiqueta="Código" nombre="codigo" valor={datos.codigo} onCambiar={cambiar} />
          <CampoTexto etiqueta="Contraseña nueva" nombre="contrasenia" tipo="password" valor={datos.contrasenia} onCambiar={cambiar} />
          {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}
          <button type="submit" className={claseBoton}>
            Cambiar contraseña
          </button>
        </form>
      )}

      {paso === 'listo' && <p className="font-body-md text-body-md text-on-surface">¡Listo! Ya podés ingresar con tu contraseña nueva.</p>}

      <button type="button" onClick={onVolver} className="w-full font-label-lg text-label-lg text-secondary hover:underline">
        Volver a ingresar
      </button>
    </div>
  )
}

export default RecuperarContrasenia
