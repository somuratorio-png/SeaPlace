import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import { traerApadrinamientos } from '../../services/apadrinar'
import { formatearFecha } from '../../utils/fechas'

// Certificado de apadrinamiento listo para imprimir o guardar como PDF con Ctrl+P.
// Al imprimir, el header, el footer y los botones se ocultan (ver @media print en index.css).
// Los apadrinamientos del usuario los pide esta página al backend cuando se monta.
const CertificadoApadrinamiento = ({ usuario, onVolver }) => {
  // El id sale de la URL (/panel/:id/certificado)
  const { id } = useParams()

  const [apadrinamientos, setApadrinamientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Un solo pedido, al abrir la página
  useEffect(() => {
    traerApadrinamientos()
      .then((lista) => {
        setApadrinamientos(lista)
      })
      .catch((falla) => {
        setError(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

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

  const item = apadrinamientos.find((a) => a.activo && a.animal.id === Number(id))

  // Si ese animal no está apadrinado, se vuelve al panel
  if (!item) {
    return <Navigate to="/panel" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile py-space-lg space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm print:hidden">
        <button onClick={() => onVolver(item)} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          <Icono nombre="arrow_back" clase="text-[18px]" /> Volver a {item.animal.nombre}
        </button>
        <p className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant">
          <Icono nombre="print" clase="text-[18px]" /> Para imprimir o guardar como PDF, usá Ctrl+P
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-sm">
        <div className="border-4 border-double border-primary rounded-xl p-space-xl text-center space-y-space-md">
          <div className="w-16 h-16 mx-auto rounded-full fondo-mar text-on-primary flex items-center justify-center">
            <Icono nombre="workspace_premium" clase="text-[36px]" />
          </div>
          <p className="font-label-md text-label-md uppercase tracking-[0.3em] text-secondary">SeaPlace · Custodia viva del Pacífico</p>
          <h1 className="font-display-lg text-display-lg-mobile text-primary">Certificado de Apadrinamiento</h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant">Se deja constancia de que</p>
          <p className="font-headline-lg text-headline-lg-mobile text-on-surface">
            {usuario.nombre} {usuario.apellido}
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant">es protector oficial de</p>

          <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-primary-fixed" />
          <p className="font-headline-lg text-headline-lg-mobile text-tertiary">{item.animal.nombre}</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {item.animal.especie} · {item.animal.ubicacion}
          </p>

          <div className="flex flex-wrap justify-center gap-space-xl pt-space-md border-t border-outline-variant">
            <div>
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Plan</p>
              <p className="font-title-lg text-title-lg text-primary">{item.plan.nombre}</p>
            </div>
            <div>
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Protector desde</p>
              <p className="font-title-lg text-title-lg text-primary">{formatearFecha(item.desde)}</p>
            </div>
            <div>
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">N.º de certificado</p>
              <p className="font-title-lg text-title-lg text-primary">{String(item.id).padStart(6, '0')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificadoApadrinamiento
