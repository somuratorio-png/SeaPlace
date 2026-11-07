import Icono from '../comunes/Icono'
import { formatearFecha } from '../../utils/fechas'
import { presentacionDelRol } from '../../utils/roles'

// Un comentario que alguien dejó sobre la página: la cita, quién lo escribió, quién es y cuándo.
// onBorrar es opcional: solo llega si quien mira puede borrarlo (es suyo o es administrador).
const TarjetaTestimonio = ({ comentario, onBorrar }) => {
  return (
    <div className="revelar bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm border-t-4 transition hover:-translate-y-1 hover:shadow-lg border-tertiary-fixed-dim">
      <div className="flex items-start justify-between">
        <Icono nombre="format_quote" clase="text-tertiary text-[32px]" />
        {onBorrar && (
          <button onClick={onBorrar} aria-label="Borrar comentario" title="Borrar comentario" className="text-on-surface-variant hover:text-error">
            <Icono nombre="delete" clase="text-[20px]" />
          </button>
        )}
      </div>
      <p className="font-body-md text-body-md text-on-surface italic whitespace-pre-line">"{comentario.texto}"</p>
      <div>
        <span className="font-title-lg text-title-lg text-primary block">{comentario.autor}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {presentacionDelRol(comentario.rol)} • {formatearFecha(comentario.fecha)}
        </span>
      </div>
    </div>
  )
}

export default TarjetaTestimonio
