import { coordenadasDe, horaDe } from '../../utils/telemetria'

// Cuándo llegó la última señal y una barrita que se vacía hasta la próxima.
// "numeroSenal" es el número de la última señal: al cambiar, la "key" reinicia la barrita.
const BarraProximaSenal = ({ ultimaRecibida, numeroSenal, enMarcha, segundosEntrePulsos }) => {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap justify-between gap-space-sm font-label-md text-label-md text-on-surface-variant">
        <span>
          Última señal: {horaDe(ultimaRecibida)} · {coordenadasDe(ultimaRecibida)}
        </span>
        <span>{enMarcha ? 'Esperando la próxima señal…' : 'Rastreo en pausa'}</span>
      </div>
      <div className="h-1.5 bg-primary-fixed rounded-full overflow-hidden">
        {enMarcha && <div key={numeroSenal} className="esperar h-full bg-secondary rounded-full" style={{ animationDuration: `${segundosEntrePulsos}s` }} />}
      </div>
    </div>
  )
}

export default BarraProximaSenal