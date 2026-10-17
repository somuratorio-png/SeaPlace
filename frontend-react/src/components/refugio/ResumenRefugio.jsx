import TarjetaDato from '../comunes/TarjetaDato'
import { formatearPrecio } from '../../contexto/Moneda'
import { recaudacionMensual } from '../../utils/precios'
import { useMoneda } from '../../hooks/useMoneda'

// Las tres tarjetas de arriba del panel del refugio: animales publicados, padrinos y recaudación mensual.
// "apadrinamientos" son los activos de los animales de este refugio.
const ResumenRefugio = ({ cantidadAnimales, apadrinamientos }) => {
  const { moneda } = useMoneda()
  const cantidadPadrinos = new Set(apadrinamientos.map((a) => a.usuario)).size

  return (
    <div className="escalonar grid grid-cols-1 sm:grid-cols-3 gap-space-md">
      <TarjetaDato icono="pets" valor={cantidadAnimales} titulo="Animales publicados" clase="bg-primary-fixed text-on-primary-fixed-variant" />
      <TarjetaDato icono="group" valor={cantidadPadrinos} titulo="Padrinos" clase="bg-secondary-container text-on-secondary-fixed-variant" />
      <TarjetaDato
        icono="payments"
        valor={formatearPrecio(recaudacionMensual(apadrinamientos), moneda)}
        titulo="Recaudación mensual"
        clase="bg-tertiary-fixed text-on-tertiary-fixed-variant"
      />
    </div>
  )
}

export default ResumenRefugio