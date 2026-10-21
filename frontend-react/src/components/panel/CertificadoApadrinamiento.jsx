import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import { useSesion } from '../../hooks/useSesion'
import { useApadrinamientoDe } from '../../hooks/useApadrinamientoDe'
import BotonVolver from '../comunes/BotonVolver'
import CertificadoImprimible from './CertificadoImprimible'

const CertificadoApadrinamiento = () => {
  const navigate = useNavigate()
  const { usuario } = useSesion()
  const { id } = useParams()

  const { item, cargando, error } = useApadrinamientoDe(id)

  if (cargando) {
    return <Cargando texto="Preparando tu certificado…" />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-margin-mobile py-space-lg">
        <AvisoError mensaje={error} />
      </div>
    )
  }

  if (!item) {
    return <Navigate to="/panel" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile py-space-lg space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm print:hidden">
        <BotonVolver
          texto={`Volver a ${item.animal.nombre}`}
          onVolver={() => navigate(`/panel/${item.animal.id}`)}
        />
        <p className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant">
          <Icono nombre="print" clase="text-[18px]" /> Para imprimir o guardar como PDF, usá Ctrl+P
        </p>
      </div>

            <CertificadoImprimible protector={usuario} item={item} />
    </div>
  )
}

export default CertificadoApadrinamiento
