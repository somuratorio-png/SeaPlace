import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Bienvenida from './Bienvenida'
import CamposRegistro from './CamposRegistro'
import EnlacesLogin from './EnlacesLogin'
import RecuperarContrasenia from './RecuperarContrasenia'
import CampoTexto from '../comunes/CampoTexto'
import MensajeError from '../comunes/MensajeError'
import { agregarAlMuelle } from '../../Redux/muelleSlice'
import { ingresar, registrar } from '../../Redux/usuarioSlice'
import { puedeApadrinar } from '../../utils/roles'
import { validarContrasenia } from '../../utils/validaciones'
import { useFormulario } from '../../hooks/useFormulario'
import BotonFormulario from '../comunes/BotonFormulario'

const formularioVacio = { nombre: '', apellido: '', mail: '', nombreUsuario: '', contrasenia: '' }

const claseDosColumnas = 'max-w-6xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-lg'

// Login y registro. Le pide al backend que valide los datos: si los rechaza, muestra el mensaje
// que mandó (por ejemplo, "Usuario o contrasenia incorrectos"). Si los acepta, la sesión queda en el
// estado global (usuarioSlice, y sus favoritos y su muelle en los suyos) y se muestra otra página.
const FormularioLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [esRegistro, setEsRegistro] = useState(false)
  const [esRefugio, setEsRefugio] = useState(false) // en el registro: ¿la cuenta es de un refugio?
  const { datos, cambiar } = useFormulario(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [recuperando, setRecuperando] = useState(false) // true = se muestra "olvidé mi contraseña"

  const cambiarModo = () => {
    setEsRegistro(!esRegistro)
    setError(null)
  }

  // Si antes de entrar había elegido un animal (viaja en la navegación), se lo agrega al muelle y lo lleva ahí.
  // Si no se pudo, va al panel con el mensaje.
  const llevarPendiente = (usuario) => {
    if (state === null || !state.pendiente || !puedeApadrinar(usuario)) {
      return
    }
    dispatch(agregarAlMuelle({ idAnimal: state.pendiente.idAnimal, codigoPlan: state.pendiente.codigoPlan })).then((accion) => {
      if (accion.error) {
        navigate('/panel', { replace: true, state: { error: accion.error.message } })
      } else {
        navigate('/muelle')
      }
    })
  }

  // dispatch devuelve una promesa con la action con la que terminó: la "fulfilled" trae la sesión en payload
  // y la "rejected" el mensaje en error. Devuelve una promesa con el mensaje de error, o null si salió bien.
  const entrarCon = (despacho) =>
    despacho.then((accion) => {
      if (accion.error) {
        return accion.error.message
      }
      llevarPendiente(accion.payload.sesion.usuario)
      return null
    })

  // Un padrino entra directo. Un refugio queda pendiente hasta que un administrador lo apruebe.
  const pedirRegistro = () => {
    const errorClave = validarContrasenia(datos.contrasenia)
    if (errorClave !== null) {
      return Promise.resolve(errorClave)
    }
    // Que el usuario o el correo no estén repetidos lo controla el backend
    const limpios = { ...datos, nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), mail: datos.mail.trim(), nombreUsuario: datos.nombreUsuario.trim() }
    return entrarCon(dispatch(registrar({ datos: limpios, esRefugio })))
  }

  // Si todo sale bien no hay nada más que hacer acá: con el usuario en el estado global se muestra otra página
  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const faltan = esRegistro
      ? !datos.apellido.trim() || !datos.mail.trim() || !datos.nombreUsuario.trim() || !datos.contrasenia.trim() || (!esRefugio && !datos.nombre.trim())
      : !datos.nombreUsuario.trim() || !datos.contrasenia.trim()
    if (faltan) {
      setError('Completá todos los campos')
      return
    }
    setEnviando(true)
    const pedido = esRegistro ? pedirRegistro() : entrarCon(dispatch(ingresar({ nombreUsuario: datos.nombreUsuario.trim(), contrasenia: datos.contrasenia })))
    pedido.then((mensaje) => {
      setError(mensaje)
      setEnviando(false)
    })
  }

  // "Olvidé mi contraseña" reemplaza al formulario hasta que se vuelve
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