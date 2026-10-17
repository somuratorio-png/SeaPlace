import FilaPago from './FilaPago'
import Precio from '../comunes/Precio'

// Lista de los pagos ya hechos por un apadrinamiento (uno por cada zarpar donde se pagó ese animal)
const HistorialPagos = ({ pagos }) => {
  const total = pagos.reduce((suma, pago) => suma + pago.monto, 0)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Historial de pagos</h2>

      {pagos.length === 0 && <p className="font-body-md text-body-md text-on-surface-variant">Todavía no hay pagos registrados.</p>}
      {pagos.map((pago) => (
        <FilaPago key={pago.id} pago={pago} />
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
