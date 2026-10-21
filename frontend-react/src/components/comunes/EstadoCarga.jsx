import AvisoError from './AvisoError'
import Cargando from './Cargando'

const EstadoCarga = ({ cargando, error, texto }) => {
  if (cargando) {
    return <Cargando texto={texto} />
  }
  return <AvisoError mensaje={error} />
}

export default EstadoCarga