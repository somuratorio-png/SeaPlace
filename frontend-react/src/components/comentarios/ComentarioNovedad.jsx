import Icono from '../comunes/Icono'
import { formatearFecha } from '../../utils/fechas'
import { colorDelRol, presentacionDelRol } from '../../utils/roles'

// Un comentario de la conversación de una novedad: la inicial del autor, quién es, cuándo y qué dijo.
// onBorrar es opcional: solo llega si quien mira puede borrarlo (es suyo o es administrador).
const ComentarioNovedad = ({ comentario, onBorrar }) => {
  return (
    <div className="flex gap-space-sm">
      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-label-lg text-label-lg ${colorDelRol(comentario.rol)}`}>
        {comentario.autor.charAt(0)}
      </div>
      <div className="flex-1 bg-surface-container-low rounded-xl px-space-md py-space-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-x-space-sm">
          <p className="font-label-lg text-label-lg text-on-surface">
            {comentario.autor}
            <span className="font-label-md text-label-md text-on-surface-variant"> · {presentacionDelRol(comentario.rol)} · {formatearFecha(comentario.fecha)}</span>
          </p>
          {onBorrar && (
            <button onClick={onBorrar} aria-label="Borrar comentario" title="Borrar comentario" className="text-on-surface-variant hover:text-error">
              <Icono nombre="delete" clase="text-[18px]" />
            </button>
          )}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-line">{comentario.texto}</p>
      </div>
    </div>
  )
}

export default ComentarioNovedad
