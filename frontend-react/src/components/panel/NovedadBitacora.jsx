import Icono from '../comunes/Icono'
import { formatearFecha } from '../../utils/fechas'

const NovedadBitacora = ({ novedad }) => {
  return (
    <div className="flex gap-space-md">
      <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <Icono nombre="edit_note" clase="text-[20px]" />
      </div>
      <div className="border-l-2 border-secondary-fixed pl-space-md">
        <p className="font-label-md text-label-md text-secondary uppercase tracking-wider">{formatearFecha(novedad.fecha)}</p>
        <p className="font-body-md text-body-md text-on-surface">{novedad.texto}</p>
      </div>
    </div>
  )
}

export default NovedadBitacora