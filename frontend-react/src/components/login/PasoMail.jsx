import BotonFormulario from '../comunes/BotonFormulario'
import CampoTexto from '../comunes/CampoTexto'
import MensajeError from '../comunes/MensajeError'

const PasoMail = ({ mail, error, onCambiar, onEnviar }) => {
  return (
    <form onSubmit={onEnviar} className="space-y-space-md">
      <p className="font-body-md text-body-md text-on-surface-variant">Escribí el correo de tu cuenta y te mandamos un código para elegir una contraseña nueva.</p>
      <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={mail} onCambiar={onCambiar} />
      {error && <MensajeError mensaje={error} />}
      <BotonFormulario>Pedir código</BotonFormulario>
    </form>
  )
}

export default PasoMail