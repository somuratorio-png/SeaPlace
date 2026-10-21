import { useState } from 'react'
import TarjetaFormularioCuenta from './TarjetaFormularioCuenta'
import CampoTexto from '../comunes/CampoTexto'
import { modificarMiPerfil } from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { useSesion } from '../../hooks/useSesion'
import { useFormulario } from '../../hooks/useFormulario'

const FormularioPerfil = () => {
  const { usuario, token, guardarPerfil } = useSesion()
  const { datos: perfil, cambiar: cambiarCampo } = useFormulario({ nombre: usuario.nombre, apellido: usuario.apellido, mail: usuario.mail })
  const [error, setError] = useState(null)
  const [guardado, setGuardado] = useState(false)

  const cambiar = (evento) => {
    cambiarCampo(evento)
    setGuardado(false)
  }

  const handleGuardar = (evento) => {
    evento.preventDefault()
    if (!perfil.nombre.trim() || !perfil.apellido.trim() || !perfil.mail.trim()) {
      setError('Completá todos los campos')
      return
    }
    intentar(modificarMiPerfil(token, { nombre: perfil.nombre.trim(), apellido: perfil.apellido.trim(), mail: perfil.mail.trim() }).then(guardarPerfil)).then((mensaje) => {
      setError(mensaje)
      setGuardado(mensaje === null)
    })
  }

  return (
    <TarjetaFormularioCuenta titulo="Mis datos" textoBoton="Guardar cambios" textoExito="¡Datos guardados!" mostrarExito={guardado} error={error} onEnviar={handleGuardar}>
      <CampoTexto etiqueta="Nombre" nombre="nombre" valor={perfil.nombre} onCambiar={cambiar} />
      <CampoTexto etiqueta="Apellido" nombre="apellido" valor={perfil.apellido} onCambiar={cambiar} />
      <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={perfil.mail} onCambiar={cambiar} />
    </TarjetaFormularioCuenta>
  )
}

export default FormularioPerfil