import { formatearFecha } from '../../utils/fechas'
import Precio from '../comunes/Precio'

// Lista de los pagos ya hechos por un apadrinamiento (uno por cada zarpar donde se pagó ese animal)
const HistorialPagos = ({ pagos }) => {
  const total = pagos.reduce((suma, pago) => suma + pago.monto, 0)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Historial de pagos</h2>

      {/* Puede haber dos pagos el mismo día, así que la fecha sola no alcanza como "key" */}
      {pagos.map((pago, indice) => (
        <div key={`${pago.fecha}-${indice}`} className="flex justify-between font-body-md text-body-md">
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
