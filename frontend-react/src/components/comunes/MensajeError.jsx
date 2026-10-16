// Cartel rojo con el error de un formulario (lo que contestó el backend o lo que falló al validar)
const MensajeError = ({ mensaje }) => {
  return <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{mensaje}</p>
}

export default MensajeError