import { useState } from 'react'
import Precio from '../comunes/Precio'

// Los colores de las dos fuentes de plata (validados para daltonismo y contra el fondo blanco)
export const COLOR_PADRINOS = '#0a8f86'
export const COLOR_PATROCINADORES = '#c2512b'

const nombresMeses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
// 'AAAA-MM' -> 'jun 26'
const nombreMes = (mes) => `${nombresMeses[Number(mes.slice(5, 7)) - 1]} ${mes.slice(2, 4)}`

const ALTO = 180 // alto en píxeles de la barra más alta

// Barras apiladas por mes: abajo lo que pagaron los padrinos, arriba lo que sumaron los patrocinadores.
// Arriba de cada barra va el total del mes; al pasar el mouse (o con el foco) se ve el detalle.
// Abajo, la misma información como tabla. meses = [{ mes: 'AAAA-MM', padrinos, patrocinadores, pagos }]
const GraficoIngresos = ({ meses }) => {
  const [elegido, setElegido] = useState(null) // el mes con el detalle abierto, o null
  const maximo = Math.max(1, ...meses.map((dato) => dato.padrinos + dato.patrocinadores))

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
      <div className="flex flex-wrap items-start justify-between gap-space-sm">
        <div>
          <h3 className="font-title-lg text-title-lg text-on-surface">Ingresos de los últimos 6 meses</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Pagos de los padrinos y lo que sumaron los patrocinadores con sus campañas.</p>
        </div>
        <div className="flex flex-wrap gap-space-md font-label-md text-label-md text-on-surface">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_PADRINOS }} /> Padrinos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_PATROCINADORES }} /> Patrocinadores
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-space-sm items-end border-b border-outline-variant pt-space-lg" style={{ height: ALTO + 56 }}>
        {meses.map((dato) => {
          const total = dato.padrinos + dato.patrocinadores
          const abierto = elegido === dato.mes
          return (
            <button
              key={dato.mes}
              type="button"
              onMouseEnter={() => setElegido(dato.mes)}
              onMouseLeave={() => setElegido(null)}
              onFocus={() => setElegido(dato.mes)}
              onBlur={() => setElegido(null)}
              aria-label={`${nombreMes(dato.mes)}: padrinos ${dato.padrinos}, patrocinadores ${dato.patrocinadores} dólares`}
              className="relative h-full flex flex-col items-center justify-end gap-1 rounded-lg hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary/40"
            >
              {abierto && (
                <span className="absolute bottom-full mb-1 z-10 w-max bg-primary whitespace-nowrap text-on-primary rounded-lg shadow-lg p-space-sm text-left font-body-sm text-body-sm space-y-0.5">
                  <b className="block">{nombreMes(dato.mes)} · {dato.pagos} {dato.pagos === 1 ? 'pago' : 'pagos'}</b>
                  <span className="block">Padrinos: <Precio valor={dato.padrinos} /></span>
                  <span className="block">Patrocinadores: <Precio valor={dato.patrocinadores} /></span>
                </span>
              )}
              <span className="font-label-md text-label-md text-on-surface tabular-nums whitespace-nowrap">{total > 0 ? <Precio valor={total} /> : '—'}</span>
              <span className="w-3/5 max-w-12 flex flex-col justify-end gap-0.5" style={{ height: (total / maximo) * ALTO }}>
                {dato.patrocinadores > 0 && <span className="w-full rounded-t" style={{ height: `${(dato.patrocinadores / total) * 100}%`, backgroundColor: COLOR_PATROCINADORES }} />}
                {dato.padrinos > 0 && <span className={`w-full ${dato.patrocinadores > 0 ? '' : 'rounded-t'}`} style={{ height: `${(dato.padrinos / total) * 100}%`, backgroundColor: COLOR_PADRINOS }} />}
              </span>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-6 gap-space-sm text-center font-label-md text-label-md text-on-surface-variant -mt-space-sm">
        {meses.map((dato) => (
          <span key={dato.mes}>{nombreMes(dato.mes)}</span>
        ))}
      </div>

      <details className="font-body-sm text-body-sm">
        <summary className="cursor-pointer text-secondary font-label-lg text-label-lg">Ver como tabla</summary>
        <table className="w-full mt-space-sm text-left tabular-nums">
          <thead className="text-on-surface-variant">
            <tr>
              <th className="py-1 font-label-md">Mes</th>
              <th className="py-1 font-label-md">Pagos</th>
              <th className="py-1 font-label-md">Padrinos</th>
              <th className="py-1 font-label-md">Patrocinadores</th>
              <th className="py-1 font-label-md">Total</th>
            </tr>
          </thead>
          <tbody>
            {meses.map((dato) => (
              <tr key={dato.mes} className="border-t border-outline-variant">
                <td className="py-1">{nombreMes(dato.mes)}</td>
                <td className="py-1">{dato.pagos}</td>
                <td className="py-1"><Precio valor={dato.padrinos} /></td>
                <td className="py-1"><Precio valor={dato.patrocinadores} /></td>
                <td className="py-1"><Precio valor={dato.padrinos + dato.patrocinadores} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}

export default GraficoIngresos
