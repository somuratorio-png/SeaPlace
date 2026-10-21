import BarraProgreso from '../comunes/BarraProgreso'
import Galeria from '../comunes/Galeria'

const HistoriaAnimal = ({ animal }) => {
  return (
    <div className="lg:col-span-7 space-y-space-lg">
      <Galeria fotos={animal.fotos} nombre={animal.nombre} />

      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Su historia</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
        <p className="font-label-lg text-label-lg text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
        <BarraProgreso porcentaje={animal.progreso} />
      </div>
    </div>
  )
}

export default HistoriaAnimal