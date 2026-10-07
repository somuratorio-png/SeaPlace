import { formatearFecha } from '../../utils/fechas'
import Precio from '../comunes/Precio'

// Lista de los pagos mensuales ya hechos por un apadrinamiento
const HistorialPagos = ({ pagos }) => {
  const total = pagos.reduce((suma, pago) => suma + pago.monto, 0)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Historial de pagos</h2>

      {pagos.map((pago) => (
        <div key={pago.fecha} className="flex justify-between font-body-md text-body-md">
          <span className="text-on-surface-variant">{formatearFecha(pago.fecha)}</span>
          <span className="text-on-surface tabular-nums">
            <Precio valor={pago.monto} />
          </span>
        </div>
      ))}

      <div className="flex justify-between pt-space-sm border-t border-outline-variant font-title-lg text-title-lg">
        <span>Aportaste en total</span>
        <span className="text-primary tabular-nums">
          <Precio valor={total} />
        </span>
      </div>
    </div>
  )
}

export default HistorialPagos
