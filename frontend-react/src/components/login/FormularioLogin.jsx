import { useState } from 'react'
import Bienvenida from './Bienvenida'
import CamposRegistro from './CamposRegistro'
import EnlacesLogin from './EnlacesLogin'
import RecuperarContrasenia from './RecuperarContrasenia'
import CampoTexto from '../comunes/CampoTexto'
import MensajeError from '../comunes/MensajeError'
import * as usuariosApi from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { validarContrasenia } from '../../utils/validaciones'
import { usePlanes } from '../../hooks/usePlanes'
import { useSesion } from '../../hooks/useSesion'
import { useFormulario } from '../../hooks/useFormulario'
import BotonFormulario from '../comunes/BotonFormulario'

const formularioVacio = { nombre: '', apellido: '', mail: '', nombreUsuario: '', contrasenia: '' }

const claseDosColumnas = 'max-w-6xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-lg'

const FormularioLogin = () => {
  const { entrar } = useSesion()
  const planes = usePlanes()
  const [esRegistro, setEsRegistro] = useState(false)
  const [esRefugio, setEsRefugio] = useState(false)
  const { datos, cambiar } = useFormulario(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [recuperando, setRecuperando] = useState(false)

  const cambiarModo = () => {
    setEsRegistro(!esRegistro)
    setError(null)
  }

  const ingresar = () => intentar(usuariosApi.ingresar(planes, datos.nombreUsuario.trim(), datos.contrasenia).then(entrar))

  const registrar = () => {
    const errorClave = validarContrasenia(datos.contrasenia)
    if (errorClave !== null) {
      return Promise.resolve(errorClave)
    }
    const limpios = { ...datos, nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), mail: datos.mail.trim(), nombreUsuario: datos.nombreUsuario.trim() }
    return intentar(usuariosApi.registrar(planes, limpios, esRefugio).then(entrar))
  }

  const enviar = (evento) => {
    evento.preventDefault()
    const faltan = esRegistro
      ? !datos.apellido.trim() || !datos.mail.trim() || !datos.nombreUsuario.trim() || !datos.contrasenia.trim() || (!esRefugio && !datos.nombre.trim())
      : !datos.nombreUsuario.trim() || !datos.contrasenia.trim()
    if (faltan) {
      setError('Completá todos los campos')
      return
    }
    setEnviando(true)
    const pedido = esRegistro ? registrar() : ingresar()
    pedido.then((mensaje) => {
      setError(mensaje)
      setEnviando(false)
    })
  }

  if (recuperando) {
    return (
      <div className={claseDosColumnas}>
        <Bienvenida />
        <RecuperarContrasenia onVolver={() => setRecuperando(false)} />
      </div>
    )
  }

  return (
    <div className={claseDosColumnas}>
      <Bienvenida />

      <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md space-y-space-md">
        <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface">
          {esRegistro ? 'Creá tu cuenta' : '¡Hola de nuevo, guardián del mar!'}
        </h1>

        {esRegistro && <CamposRegistro datos={datos} esRefugio={esRefugio} onCambiar={cambiar} onCambiarTipo={setEsRefugio} />}
        <CampoTexto etiqueta="Nombre de usuario" nombre="nombreUsuario" valor={datos.nombreUsuario} onCambiar={cambiar} />
        <CampoTexto etiqueta="Contraseña" nombre="contrasenia" tipo="password" valor={datos.contrasenia} onCambiar={cambiar} />

        {error && <MensajeError mensaje={error} />}

        <BotonFormulario deshabilitado={enviando}>{esRegistro ? 'Crear cuenta' : 'Ingresar'}</BotonFormulario>

        <EnlacesLogin esRegistro={esRegistro} onCambiarModo={cambiarModo} onRecuperar={() => setRecuperando(true)} />
      </form>
    </div>
  )
}

export default FormularioLogin