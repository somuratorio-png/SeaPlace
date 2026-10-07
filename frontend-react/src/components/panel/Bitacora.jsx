import { formatearFecha } from '../../utils/fechas'
import Icono from '../comunes/Icono'

// Novedades que el refugio fue publicando sobre el animal, de la más nueva a la más vieja
const Bitacora = ({ nombre, novedades }) => {
  // Las fechas son texto 'AAAA-MM-DD', así que se pueden ordenar comparándolas como texto
  const ordenadas = [...novedades].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Bitácora de {nombre}</h2>

      {ordenadas.length === 0 && (
        <p className="font-body-md text-body-md text-on-surface-variant">El refugio todavía no publicó novedades.</p>
      )}

      {ordenadas.map((novedad) => (
        <div key={novedad.id} className="flex gap-space-md">
          <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <Icono nombre="edit_note" clase="text-[20px]" />
          </div>
          <div className="border-l-2 border-secondary-fixed pl-space-md">
            <p className="font-label-md text-label-md text-secondary uppercase tracking-wider">{formatearFecha(novedad.fecha)}</p>
            <p className="font-body-md text-body-md text-on-surface">{novedad.texto}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Bitacora
