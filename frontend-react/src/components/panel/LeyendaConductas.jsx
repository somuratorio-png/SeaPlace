import { conductas } from '../../utils/telemetria'

// Qué significa el color de cada punto del mapa
const LeyendaConductas = () => {
  return (
    <div className="flex flex-wrap gap-x-space-md gap-y-1 font-label-md text-label-md text-on-surface-variant">
      {Object.values(conductas).map((conducta) => (
        <span key={conducta.nombre} className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full ring-1 ring-outline" style={{ backgroundColor: conducta.color }} />
          {conducta.nombre}
        </span>
      ))}
      <span>· Círculo punteado: su zona habitual</span>
    </div>
  )
}

export default LeyendaConductas