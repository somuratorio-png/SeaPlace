import Icono from '../comunes/Icono'

// Una métrica comercial: el número grande, qué es y una línea que lo explica.
// "alerta" la pinta como algo a vigilar (por ejemplo, muchas bajas), con su ícono además del color.
const TarjetaMetrica = ({ icono, valor, titulo, detalle, alerta = false }) => {
  return (
    <div className={`rounded-2xl p-space-lg shadow-sm space-y-1 ${alerta ? 'bg-error-container text-on-error-container' : 'bg-surface-container-lowest text-on-surface'}`}>
      <div className="flex items-center justify-between">
        <Icono nombre={icono} clase={`text-[24px] ${alerta ? '' : 'text-secondary'}`} />
        {alerta && (
          <span className="inline-flex items-center gap-1 font-label-md text-label-md">
            <Icono nombre="warning" clase="text-[16px]" /> A vigilar
          </span>
        )}
      </div>
      <div className="font-headline-md text-headline-md tabular-nums">{valor}</div>
      <div className="font-label-lg text-label-lg">{titulo}</div>
      {detalle && <p className={`font-body-sm text-body-sm ${alerta ? '' : 'text-on-surface-variant'}`}>{detalle}</p>}
    </div>
  )
}

export default TarjetaMetrica
