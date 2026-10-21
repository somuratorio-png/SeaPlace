import Icono from '../comunes/Icono'
import FichaAnimal from './FichaAnimal'
import GestionPlan from './GestionPlan'
import HistorialPagos from './HistorialPagos'
import MiPlan from './MiPlan'
import ProgresoMeta from './ProgresoMeta'
import { formatearFecha } from '../../utils/fechas'

const ResumenApadrinado = ({ item, onVerCertificado, onCambiarPlan, onCancelar }) => {
  const { animal, plan } = item

  return (
    <div className="lg:col-span-5 space-y-space-md">
      <div>
        <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
          Tu apadrinado desde el {formatearFecha(item.desde)}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{animal.nombre}</h1>
      </div>

      <button
        onClick={onVerCertificado}
        className="w-full inline-flex items-center justify-center gap-1 bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full shadow-md hover:bg-tertiary-container"
      >
        <Icono nombre="workspace_premium" clase="text-[20px]" /> Ver mi certificado
      </button>

      <ProgresoMeta progreso={animal.progreso} />
      <FichaAnimal animal={animal} />
      <MiPlan plan={plan} cupos={item.cupos} />
      <HistorialPagos pagos={item.pagos} />
      <GestionPlan item={item} onCambiarPlan={onCambiarPlan} onCancelar={onCancelar} />
    </div>
  )
}

export default ResumenApadrinado