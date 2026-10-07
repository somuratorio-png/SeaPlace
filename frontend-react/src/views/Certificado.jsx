import { Navigate, useParams } from 'react-router-dom'
import Icono from '../components/comunes/Icono'
import { formatearFecha } from '../utils/fechas'

// Certificado de apadrinamiento listo para imprimir o guardar como PDF.
// Lo que tiene la clase "print:hidden" no sale en la impresión.
const Certificado = ({ usuario, apadrinados, onVolver }) => {
  // El id sale de la URL (/panel/:id/certificado)
  const { id } = useParams()
  const item = apadrinados.find((a) => a.animal.id === id)

  if (!item) {
    return <Navigate to="/panel" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile py-space-lg space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm print:hidden">
        <button onClick={() => onVolver(item)} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant hover:text-primary">
          <Icono nombre="arrow_back" clase="text-[18px]" /> Volver a {item.animal.nombre}
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-1 bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-surface-tint">
          <Icono nombre="print" clase="text-[18px]" /> Imprimir o guardar como PDF
        </button>
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
              <p className="font-title-lg text-title-lg text-primary">{item.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Certificado
