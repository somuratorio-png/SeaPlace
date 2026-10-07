import BarraProgreso from '../components/comunes/BarraProgreso'
import Icono from '../components/comunes/Icono'
import Galeria from '../components/detalle/Galeria'
import FichaAnimal from '../components/panel/FichaAnimal'
import MiPlan from '../components/panel/MiPlan'
import Rastreo from '../components/panel/Rastreo'
import RastreoBloqueado from '../components/panel/RastreoBloqueado'

// Detalle de un animal que el usuario ya apadrinó. item = { animal, plan }
const Apadrinado = ({ item, onVolver }) => {
  const { animal, plan } = item

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
      <button onClick={onVolver} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
        <Icono nombre="arrow_back" clase="text-[18px]" /> Volver a mis apadrinados
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-7 space-y-space-lg">
          <Galeria fotos={animal.fotos} nombre={animal.nombre} />

          {/* La ubicación solo se muestra con el plan más alto */}
          {plan.ubicacionEnVivo ? <Rastreo animal={animal} /> : <RastreoBloqueado nombre={animal.nombre} />}

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Su historia</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">Tu apadrinado</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface">Cómo viene</h2>
            <p className="font-label-lg text-label-lg text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
            <BarraProgreso porcentaje={animal.progreso} />
          </div>

          <FichaAnimal animal={animal} />
          <MiPlan plan={plan} />
        </div>
      </div>
    </div>
  )
}

export default Apadrinado
