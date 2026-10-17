import CampoTexto from '../comunes/CampoTexto'
import SelectorTipoCuenta from './SelectorTipoCuenta'

// Los datos que se piden de más al crear una cuenta: el tipo de cuenta, el nombre y el correo.
// Un refugio escribe solo el nombre del refugio (se guarda como apellido).
const CamposRegistro = ({ datos, esRefugio, onCambiar, onCambiarTipo }) => {
  return (
    <>
      <SelectorTipoCuenta esRefugio={esRefugio} onCambiar={onCambiarTipo} />

      {esRefugio ? (
        <>
          <CampoTexto etiqueta="Nombre del refugio" nombre="apellido" valor={datos.apellido} onCambiar={onCambiar} />
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Un administrador va a revisar tu solicitud antes de que puedas publicar animales.
          </p>
        </>
      ) : (
        <>
          <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={onCambiar} />
          <CampoTexto etiqueta="Apellido" nombre="apellido" valor={datos.apellido} onCambiar={onCambiar} />
        </>
      )}
      <CampoTexto etiqueta="Correo electrónico" nombre="mail" tipo="email" valor={datos.mail} onCambiar={onCambiar} />
    </>
  )
}

export default CamposRegistro