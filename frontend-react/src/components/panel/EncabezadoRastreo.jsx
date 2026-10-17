import Icono from '../comunes/Icono'
import { HORAS_ENTRE_SENALES } from '../../utils/telemetria'

// Título del rastreo, el estado de la última señal y el botón para pausar o reanudar.
// "perdida" es true si la última señal no llegó.
const EncabezadoRastreo = ({ nombre, perdida, enMarcha, onAlternar }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-space-sm">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-primary">Rastreo satelital</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          El transmisor de {nombre} envía su posición cada {HORAS_ENTRE_SENALES} horas, cuando sale a la superficie.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-space-md">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-space-md py-1 font-label-md text-label-md ${
            perdida ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-secondary-container text-on-secondary-fixed-variant'
          }`}
        >
          <Icono nombre={perdida ? 'signal_disconnected' : 'satellite_alt'} clase="text-[16px]" />
          {perdida ? 'Sin señal' : 'Señal recibida'}
        </span>
        <button
          onClick={onAlternar}
          className="inline-flex items-center gap-1 bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-surface-tint"
        >
          <Icono nombre={enMarcha ? 'pause' : 'play_arrow'} clase="text-[18px]" />
          {enMarcha ? 'Pausar' : 'Reanudar'}
        </button>
      </div>
    </div>
  )
}

export default EncabezadoRastreo