import MensajeVacio from '../comunes/MensajeVacio'
import BarraRecaudacion from './BarraRecaudacion'

const GraficoRecaudacion = ({ datos }) => {
  const ordenados = [...datos].sort((a, b) => b.valor - a.valor)
  const maximo = Math.max(1, ...ordenados.map((dato) => dato.valor))

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
      <div>
        <h3 className="font-title-lg text-title-lg text-on-surface">Recaudación mensual por refugio</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Suma de los apadrinamientos activos de cada uno.</p>
      </div>

      {ordenados.length === 0 && <MensajeVacio>Todavía no hay refugios aprobados para mostrar.</MensajeVacio>}
      {ordenados.map((dato) => (
        <BarraRecaudacion key={dato.id} dato={dato} maximo={maximo} />
      ))}
    </div>
  )
}

export default GraficoRecaudacion
