import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import { useSesion } from '../../hooks/useSesion'
import { useApadrinamientoDe } from '../../hooks/useApadrinamientoDe'
import BotonVolver from '../comunes/BotonVolver'
import CertificadoImprimible from './CertificadoImprimible'

// Certificado de apadrinamiento listo para imprimir o guardar como PDF con Ctrl+P.
// Al imprimir, el header, el footer y los botones se ocultan (ver @media print en index.css).
// Los apadrinamientos del usuario los pide esta página al backend cuando se monta.
const CertificadoApadrinamiento = () => {
  // El id sale de la URL (/panel/:id/certificado)
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

  // Si ese animal no está apadrinado, se vuelve al panel
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
