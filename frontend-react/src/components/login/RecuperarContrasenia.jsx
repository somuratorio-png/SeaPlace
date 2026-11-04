import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pedirCodigo, restablecerContrasenia } from '../../Redux/usuarioSlice'
import { intentar } from '../../utils/intentar'
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
  const dispatch = useDispatch()
  // Lo que contestó el backend al pedir el código: queda en el estado global (usuarioSlice)
  const { mensaje: aviso } = useSelector((state) => state.usuario)
  const [paso, setPaso] = useState('mail') // 'mail' | 'codigo' | 'listo'
  const { datos, cambiar } = useFormulario(formularioVacio)
  const [error, setError] = useState(null)

  // Si el pedido sale bien se pasa al paso siguiente; si no, se muestra el mensaje del backend
  const avanzar = (despacho, pasoSiguiente) => {
    intentar(despacho).then((mensaje) => {
      setError(mensaje)
      if (mensaje === null) {
        setPaso(pasoSiguiente)
      }
    })
  }

  const pedir = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (!datos.mail.trim()) {
      setError('Completá todos los campos')
      return
    }
    avanzar(dispatch(pedirCodigo(datos.mail)), 'codigo')
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
    avanzar(dispatch(restablecerContrasenia({ mail: datos.mail, codigo: datos.codigo.trim(), contraseniaNueva: datos.contrasenia })), 'listo')
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
