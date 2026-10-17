import BarraRecaudacion from './BarraRecaudacion'

// Gráfico de barras horizontales: cuánto recauda por mes cada refugio, de mayor a menor.
// datos = [{ nombre, valor (en dólares), padrinos }]
const GraficoRecaudacion = ({ datos }) => {
  const ordenados = [...datos].sort((a, b) => b.valor - a.valor)
  // La barra más larga ocupa todo el ancho; las demás se miden contra ella
  const maximo = Math.max(1, ...ordenados.map((dato) => dato.valor))

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
      <div>
        <h3 className="font-title-lg text-title-lg text-on-surface">Recaudación mensual por refugio</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Suma de los apadrinamientos activos de cada uno.</p>
      </div>

      {ordenados.map((dato) => (
        <BarraRecaudacion key={dato.nombre} dato={dato} maximo={maximo} />
      ))}
    </div>
  )
}

export default GraficoRecaudacion
