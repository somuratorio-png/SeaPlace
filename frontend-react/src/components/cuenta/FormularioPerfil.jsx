import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TarjetaFormularioCuenta from './TarjetaFormularioCuenta'
import CampoTexto from '../comunes/CampoTexto'
import { modificarMiPerfil } from '../../Redux/usuarioSlice'
import { intentar } from '../../utils/intentar'
import { useFormulario } from '../../hooks/useFormulario'

// "Mis datos": el usuario cambia su nombre, su apellido y su correo. Le pide el cambio al backend y muestra
// acá mismo su mensaje de error. El usuario modificado queda en el estado global: se ve en toda la página.
const FormularioPerfil = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { datos: perfil, cambiar: cambiarCampo } = useFormulario({ nombre: usuario.nombre, apellido: usuario.apellido, mail: usuario.mail })
  const [error, setError] = useState(null)
  const [guardado, setGuardado] = useState(false)

  const cambiar = (evento) => {
    cambiarCampo(evento)
    setGuardado(false)
  }

  const handleGuardar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (!perfil.nombre.trim() || !perfil.apellido.trim() || !perfil.mail.trim()) {
      setError('Completá todos los campos')
      return
    }
    intentar(dispatch(modificarMiPerfil({ nombre: perfil.nombre.trim(), apellido: perfil.apellido.trim(), mail: perfil.mail.trim() }))).then((mensaje) => {
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