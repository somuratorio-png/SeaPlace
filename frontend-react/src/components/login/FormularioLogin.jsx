import { useState } from 'react'
import Bienvenida from './Bienvenida'
import CampoTexto from './CampoTexto'
import RecuperarContrasenia from './RecuperarContrasenia'
import * as usuariosApi from '../../services/usuarios'
import { intentar } from '../../utils/intentar'
import { useSesion } from '../../hooks/useSesion'

const formularioVacio = { nombre: '', apellido: '', mail: '', nombreUsuario: '', contrasenia: '' }

// Login y registro. Le pide al backend que valide los datos: si los rechaza, muestra el mensaje
const FormularioLogin = () => {
  const { entrar } = useSesion()
  const [esRegistro, setEsRegistro] = useState(false)
  const [esRefugio, setEsRefugio] = useState(false) // en el registro: ¿la cuenta es de un refugio?
  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [recuperando, setRecuperando] = useState(false) // true = se muestra "olvidé mi contraseña"

  // Un solo manejador para todos los campos: usa el "name" del input para saber cuál cambió
  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  const cambiarModo = () => {
    setEsRegistro(!esRegistro)
    setError(null)
  }

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien

  const ingresar = () => intentar(usuariosApi.ingresar(datos.nombreUsuario.trim(), datos.contrasenia).then(entrar))

  // Un padrino entra directo. Un refugio queda pendiente hasta que un administrador lo apruebe.
  const registrar = () => {
    if (datos.contrasenia.length < 8) {
      return Promise.resolve('La contraseña debe tener al menos 8 caracteres')
    }
    // Que el usuario o el correo no estén repetidos lo controla el backend
    const limpios = { ...datos, nombre: datos.nombre.trim(), apellido: datos.apellido.trim(), mail: datos.mail.trim(), nombreUsuario: datos.nombreUsuario.trim() }
    return intentar(usuariosApi.registrar(limpios, esRefugio).then(entrar))
  }

  // Si todo sale bien no hay nada más que hacer acá: App ya sabe quién entró y muestra otra página
  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    setEnviando(true)
    const pedido = esRegistro ? registrar() : ingresar()
    pedido.then((mensaje) => {
      setError(mensaje)
      setEnviando(false)
    })
  }

  // "Olvidé mi contraseña" reemplaza al formulario hasta que se vuelve
  if (recuperando) {
    return (
      <div className="max-w-6xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        <Bienvenida />
        <RecuperarContrasenia onVolver={() => setRecuperando(false)} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
      <Bienvenida />

      <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md space-y-space-md">
        <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface">
          {esRegistro ? 'Creá tu cuenta' : '¡Hola de nuevo, guardián del mar!'}
        </h1>

        {esRegistro && (
          <>
            <div className="grid grid-cols-2 gap-space-xs bg-primary-fixed/70 rounded-full p-1" role="group" aria-label="Tipo de cuenta">
              <button type="button" onClick={() => setEsRefugio(false)} aria-pressed={!esRefugio} className={`py-space-sm rounded-full font-label-lg text-label-lg transition ${esRefugio ? 'text-on-surface-variant' : 'bg-primary text-on-primary shadow-sm'}`}>
                Quiero apadrinar
              </button>
              <button type="button" onClick={() => setEsRefugio(true)} aria-pressed={esRefugio} className={`py-space-sm rounded-full font-label-lg text-label-lg transition ${esRefugio ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}`}>
                Soy un refugio
              </button>
            </div>

            {esRefugio ? (
              <>
                <CampoTexto etiqueta="Nombre del refugio" nombre="apellido" valor={datos.apellido} onCambiar={cambiar} />
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Un administrador va a revisar tu solicitud antes de que puedas publicar animales.
                </p>
              </>
            ) : (
              <>
                <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
                <CampoTexto etiqueta="Apellido" nombre="apellido" valor={datos.apellido} onCambiar={cambiar} />
              </>
            )}
            <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={datos.mail} onCambiar={cambiar} />
          </>
        )}
        <CampoTexto etiqueta="Nombre de usuario" nombre="nombreUsuario" valor={datos.nombreUsuario} onCambiar={cambiar} />
        <CampoTexto etiqueta="Contraseña" nombre="contrasenia" tipo="password" valor={datos.contrasenia} onCambiar={cambiar} />

        {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}

        <button type="submit" disabled={enviando} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-3 rounded-full hover:bg-tertiary-container disabled:opacity-60">
          {esRegistro ? 'Crear cuenta' : 'Ingresar'}
        </button>

        <button type="button" onClick={cambiarModo} className="w-full font-label-lg text-label-lg text-secondary hover:underline">
          {esRegistro ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
        </button>

        {!esRegistro && (
          <button type="button" onClick={() => setRecuperando(true)} className="w-full font-label-lg text-label-lg text-on-surface-variant hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {!esRegistro && (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Para probar: usuario <b>marina</b>, contraseña <b>foquita123</b>
            <br />
            Administrador: usuario <b>admin</b>, contraseña <b>admin1234</b>
            <br />
            Refugio: usuario <b>ensenada</b>, contraseña <b>refugio123</b>
          </p>
        )}
      </form>
    </div>
  )
}

export default FormularioLogin
