import { useState } from 'react'
import { pedirCodigo, restablecerContrasenia } from '../../services/usuarios'
import { useFormulario } from '../../hooks/useFormulario'
import { validarContrasenia } from '../../utils/validaciones'
import PasoCodigo from './PasoCodigo'
import PasoMail from './PasoMail'

const formularioVacio = { mail: '', codigo: '', contrasenia: '' }

// "Olvidé mi contraseña", en dos pasos:
// 1) se escribe el mail y el backend genera un código de un solo uso (vence a los 5 minutos);
// 2) con ese código se elige la contraseña nueva.
// El proyecto no manda correos de verdad: el código sale impreso en la consola del backend.
// onVolver vuelve al formulario de ingreso.
const RecuperarContrasenia = ({ onVolver }) => {
  const [paso, setPaso] = useState('mail') // 'mail' | 'codigo' | 'listo'
  const { datos, cambiar } = useFormulario(formularioVacio)
  const [aviso, setAviso] = useState(null) // lo que contestó el backend al pedir el código
  const [error, setError] = useState(null)

  const pedir = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (!datos.mail.trim()) {
      setError('Completá todos los campos')
      return
    }
    pedirCodigo(datos.mail)
      .then((mensaje) => {
        setAviso(mensaje)
        setError(null)
        setPaso('codigo')
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  const restablecer = (evento) => {
    evento.preventDefault()
    if (!datos.codigo.trim() || !datos.contrasenia.trim()) {
      setError('Completá todos los campos')
      return
    }
    const errorClave = validarContrasenia(datos.contrasenia)
    if (errorClave !== null) {
      setError(errorClave)
      return
    }
    restablecerContrasenia(datos.mail, datos.codigo.trim(), datos.contrasenia)
      .then(() => {
        setError(null)
        setPaso('listo')
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md space-y-space-md">
      <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface">Recuperá tu contraseña</h1>
      {paso === 'mail' && <PasoMail mail={datos.mail} error={error} onCambiar={cambiar} onEnviar={pedir} />}
      {paso === 'codigo' && (
        <PasoCodigo aviso={aviso} codigo={datos.codigo} contrasenia={datos.contrasenia} error={error} onCambiar={cambiar} onEnviar={restablecer} />
      )}
      {paso === 'listo' && <p className="font-body-md text-body-md text-on-surface">¡Listo! Ya podés ingresar con tu contraseña nueva.</p>}

      <button type="button" onClick={onVolver} className="w-full font-label-lg text-label-lg text-secondary hover:underline">
        Volver a ingresar
      </button>
    </div>
  )
}

export default RecuperarContrasenia
