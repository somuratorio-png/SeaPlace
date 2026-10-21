import { useState } from 'react'
import { pedirCodigo, restablecerContrasenia } from '../../services/usuarios'
import { useFormulario } from '../../hooks/useFormulario'
import { validarContrasenia } from '../../utils/validaciones'
import PasoCodigo from './PasoCodigo'
import PasoMail from './PasoMail'

const formularioVacio = { mail: '', codigo: '', contrasenia: '' }

const RecuperarContrasenia = ({ onVolver }) => {
  const [paso, setPaso] = useState('mail')
  const { datos, cambiar } = useFormulario(formularioVacio)
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState(null)

  const pedir = (evento) => {
    evento.preventDefault()
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
