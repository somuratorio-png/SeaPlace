import Precio from '../comunes/Precio'

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
        <div
          key={dato.nombre}
          title={`${dato.nombre}: ${dato.padrinos} ${dato.padrinos === 1 ? 'apadrinamiento activo' : 'apadrinamientos activos'}`}
          className="group grid grid-cols-12 items-center gap-space-sm"
        >
          <span className="col-span-12 sm:col-span-4 font-body-sm text-body-sm text-on-surface truncate">{dato.nombre}</span>
          <div className="col-span-9 sm:col-span-6 h-3 border-l border-outline">
            <div
              className="h-full bg-primary rounded-r transition-opacity group-hover:opacity-80"
              style={{ width: `${(dato.valor / maximo) * 100}%` }}
            />
          </div>
          <span className="col-span-3 sm:col-span-2 font-label-lg text-label-lg text-on-surface text-right tabular-nums">
            <Precio valor={dato.valor} />
          </span>
        </div>
      ))}
    </div>
  )
}

export default GraficoRecaudacion
