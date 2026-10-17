import Precio from '../comunes/Precio'

// Una barra del gráfico: el nombre del refugio, la barra y lo que recauda por mes.
// "maximo" es el valor de la barra más larga: la barra se mide contra él.
const BarraRecaudacion = ({ dato, maximo }) => {
  return (
    <div
      title={`${dato.nombre}: ${dato.padrinos} ${dato.padrinos === 1 ? 'apadrinamiento activo' : 'apadrinamientos activos'}`}
      className="group grid grid-cols-12 items-center gap-space-sm"
    >
      <span className="col-span-12 sm:col-span-4 font-body-sm text-body-sm text-on-surface truncate">{dato.nombre}</span>
      <div className="col-span-9 sm:col-span-6 h-3 border-l border-outline">
        <div className="h-full bg-primary rounded-r transition-opacity group-hover:opacity-80" style={{ width: `${(dato.valor / maximo) * 100}%` }} />
      </div>
      <span className="col-span-3 sm:col-span-2 font-label-lg text-label-lg text-on-surface text-right tabular-nums">
        <Precio valor={dato.valor} />
      </span>
    </div>
  )
}

export default BarraRecaudacion