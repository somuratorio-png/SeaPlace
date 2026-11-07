import Icono from '../comunes/Icono'
import ConversacionNovedad from '../comentarios/ConversacionNovedad'
import { formatearFecha } from '../../utils/fechas'

// Una novedad que publicó el refugio: su fecha, su texto y debajo la conversación de sus padrinos
const NovedadBitacora = ({ idAnimal, novedad }) => {
  return (
    <div className="flex gap-space-md">
      <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <Icono nombre="edit_note" clase="text-[20px]" />
      </div>
      <div className="flex-1 border-l-2 border-secondary-fixed pl-space-md">
        <p className="font-label-md text-label-md text-secondary uppercase tracking-wider">{formatearFecha(novedad.fecha)}</p>
        <p className="font-body-md text-body-md text-on-surface">{novedad.texto}</p>
        <ConversacionNovedad idAnimal={idAnimal} novedad={novedad} />
      </div>
    </div>
  )
}

export default NovedadBitacora
