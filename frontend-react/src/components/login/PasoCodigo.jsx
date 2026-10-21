import BotonFormulario from '../comunes/BotonFormulario'
import CampoTexto from '../comunes/CampoTexto'
import MensajeError from '../comunes/MensajeError'

const PasoCodigo = ({ aviso, codigo, contrasenia, error, onCambiar, onEnviar }) => {
  return (
    <form onSubmit={onEnviar} className="space-y-space-md">
      <p className="bg-secondary-container text-on-secondary-fixed-variant rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{aviso}</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        El código vence a los 5 minutos. Como es una demo, no llega por correo: aparece en la consola del servidor.
      </p>
      <CampoTexto etiqueta="Código" nombre="codigo" valor={codigo} onCambiar={onCambiar} />
      <CampoTexto etiqueta="Contraseña nueva" nombre="contrasenia" tipo="password" valor={contrasenia} onCambiar={onCambiar} />
      {error && <MensajeError mensaje={error} />}
      <BotonFormulario>Cambiar contraseña</BotonFormulario>
    </form>
  )
}

export default PasoCodigo