import AvisoError from './AvisoError'
import BotonVolver from './BotonVolver'

// Lo que se ve cuando una página no pudo cargar lo que pedía: el mensaje de error y un botón para volver
const ErrorConVolver = ({ mensaje, textoVolver, onVolver }) => {
  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
      <AvisoError mensaje={mensaje} />
      <BotonVolver texto={textoVolver} onVolver={onVolver} />
    </div>
  )
}

export default ErrorConVolver