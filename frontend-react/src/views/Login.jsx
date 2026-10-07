import { useState } from 'react'
import Bienvenida from '../components/login/Bienvenida'
import CampoTexto from '../components/login/CampoTexto'

const formularioVacio = { nombre: '', apellido: '', mail: '', nombreUsuario: '', contrasenia: '' }

// Login y registro (mock: se valida contra la lista de usuarios que recibe por props)
const Login = ({ usuarios, onIngresar, onRegistrar }) => {
  const [esRegistro, setEsRegistro] = useState(false)
  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)

  // Un solo manejador para todos los campos: usa el "name" del input para saber cuál cambió
  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  const cambiarModo = () => {
    setEsRegistro(!esRegistro)
    setError(null)
  }

  const ingresar = () => {
    const encontrado = usuarios.find(
      (usuario) => usuario.nombreUsuario === datos.nombreUsuario && usuario.contrasenia === datos.contrasenia,
    )
    if (!encontrado) {
      setError('Usuario o contraseña incorrectos')
      return
    }
    onIngresar(encontrado)
  }

  const registrar = () => {
    if (datos.contrasenia.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (usuarios.some((usuario) => usuario.nombreUsuario === datos.nombreUsuario)) {
      setError(`El usuario ${datos.nombreUsuario} ya existe`)
      return
    }
    onRegistrar(datos)
  }

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (esRegistro) {
      registrar()
    } else {
      ingresar()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
      <Bienvenida />

      <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-xl shadow-md space-y-space-md">
        <h1 className="font-headline-lg text-headline-lg-mobile text-on-surface">
          {esRegistro ? 'Creá tu cuenta de protector' : '¡Hola de nuevo, guardián del mar!'}
        </h1>

        {esRegistro && (
          <>
            <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
            <CampoTexto etiqueta="Apellido" nombre="apellido" valor={datos.apellido} onCambiar={cambiar} />
            <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={datos.mail} onCambiar={cambiar} />
          </>
        )}
        <CampoTexto etiqueta="Nombre de usuario" nombre="nombreUsuario" valor={datos.nombreUsuario} onCambiar={cambiar} />
        <CampoTexto etiqueta="Contraseña" nombre="contrasenia" tipo="password" valor={datos.contrasenia} onCambiar={cambiar} />

        {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}

        <button type="submit" className="w-full bg-primary text-on-primary font-title-lg text-title-lg py-3 rounded-lg hover:bg-primary-container">
          {esRegistro ? 'Crear cuenta' : 'Ingresar'}
        </button>

        <button type="button" onClick={cambiarModo} className="w-full font-label-lg text-label-lg text-secondary hover:underline">
          {esRegistro ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
        </button>

        {!esRegistro && (
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Para probar: usuario <b>marina</b>, contraseña <b>foquita123</b>
          </p>
        )}
      </form>
    </div>
  )
}

export default Login
