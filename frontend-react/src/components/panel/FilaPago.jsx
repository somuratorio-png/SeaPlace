import Precio from '../comunes/Precio'
import { formatearFecha } from '../../utils/fechas'

const FilaPago = ({ pago }) => {
  return (
    <div className="flex justify-between font-body-md text-body-md">
      <span className="text-on-surface-variant">{formatearFecha(pago.fecha)}</span>
      <span className="text-on-surface tabular-nums">
        <Precio valor={pago.monto} />
      </span>
    </div>
  )
}

export default FilaPago