import { useState } from 'react'
import TarjetaFormularioCuenta from './TarjetaFormularioCuenta'
import CampoTexto from '../comunes/CampoTexto'
import { cambiarMiContrasenia } from '../../services/usuarios'
import { useSesion } from '../../hooks/useSesion'
import { intentar } from '../../utils/intentar'
import { validarContrasenia } from '../../utils/validaciones'
import { useFormulario } from '../../hooks/useFormulario'

const sinContrasenias = { actual: '', nueva: '', repetida: '' }

// "Cambiar contraseña": pide la actual y la nueva dos veces. Le pide el cambio al backend y muestra
// acá mismo su mensaje de error.
const FormularioContrasenia = () => {
  const { token } = useSesion()
  const { datos: contrasenias, cambiar: cambiarCampo, reiniciar } = useFormulario(sinContrasenias)
  const [error, setError] = useState(null)
  const [cambiada, setCambiada] = useState(false)

  const cambiar = (evento) => {
    cambiarCampo(evento)
    setCambiada(false)
  }

  const guardar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (!contrasenias.actual.trim() || !contrasenias.nueva.trim() || !contrasenias.repetida.trim()) {
      setError('Completá todos los campos')
      return
    }
    const errorClave = validarContrasenia(contrasenias.nueva, 'La contraseña nueva')
    if (errorClave !== null) {
      setError(errorClave)
      return
    }
    if (contrasenias.nueva !== contrasenias.repetida) {
      setError('Las dos contraseñas nuevas no coinciden')
      return
    }
    intentar(cambiarMiContrasenia(token, contrasenias.actual, contrasenias.nueva)).then((mensaje) => {
      setError(mensaje)
      setCambiada(mensaje === null)
      if (mensaje === null) {
        reiniciar()
      }
    })
  }

  return (
    <TarjetaFormularioCuenta titulo="Cambiar contraseña" textoBoton="Cambiar contraseña" textoExito="¡Contraseña cambiada!" mostrarExito={cambiada} error={error} onEnviar={guardar}>
      <CampoTexto etiqueta="Contraseña actual" nombre="actual" tipo="password" valor={contrasenias.actual} onCambiar={cambiar} />
      <CampoTexto etiqueta="Contraseña nueva" nombre="nueva" tipo="password" valor={contrasenias.nueva} onCambiar={cambiar} />
      <CampoTexto etiqueta="Repetí la contraseña nueva" nombre="repetida" tipo="password" valor={contrasenias.repetida} onCambiar={cambiar} />
    </TarjetaFormularioCuenta>
  )
}

export default FormularioContrasenia