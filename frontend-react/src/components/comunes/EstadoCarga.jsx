import AvisoError from './AvisoError'
import Cargando from './Cargando'

// Lo que se ve en lugar del contenido mientras la pantalla espera los datos del backend, o si el pedido falló.
// La pantalla decide cuándo usarlo: if (cargando || error) { return <EstadoCarga ... /> }
const EstadoCarga = ({ cargando, error, texto }) => {
  if (cargando) {
    return <Cargando texto={texto} />
  }
  return <AvisoError mensaje={error} />
}

export default EstadoCarga