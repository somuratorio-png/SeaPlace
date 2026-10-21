import Galeria from '../comunes/Galeria'
import Bitacora from './Bitacora'

const HistoriaApadrinado = ({ animal, novedades }) => {
  return (
    <div className="lg:col-span-7 space-y-space-lg">
      <Galeria fotos={animal.fotos} nombre={animal.nombre} />

      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
        <h2 className="font-headline-sm text-headline-sm text-primary">Su historia</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
      </div>

      <Bitacora nombre={animal.nombre} novedades={novedades} />
    </div>
  )
}

export default HistoriaApadrinado