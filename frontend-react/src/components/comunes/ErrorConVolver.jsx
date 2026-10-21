import AvisoError from './AvisoError'
import BotonVolver from './BotonVolver'

const ErrorConVolver = ({ mensaje, textoVolver, onVolver }) => {
  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-md">
      <AvisoError mensaje={mensaje} />
      <BotonVolver texto={textoVolver} onVolver={onVolver} />
    </div>
  )
}

export default ErrorConVolver