import Icono from '../comunes/Icono'
import DatoCertificado from './DatoCertificado'
import { formatearFecha } from '../../utils/fechas'

const CertificadoImprimible = ({ protector, item }) => {
  const { animal, plan } = item

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-sm">
      <div className="border-4 border-double border-primary rounded-xl p-space-xl text-center space-y-space-md">
        <div className="w-16 h-16 mx-auto rounded-full fondo-mar text-on-primary flex items-center justify-center">
          <Icono nombre="workspace_premium" clase="text-[36px]" />
        </div>
        <p className="font-label-md text-label-md uppercase tracking-[0.3em] text-secondary">SeaPlace · Custodia viva del Pacífico</p>
        <h1 className="font-display-lg text-display-lg-mobile text-primary">Certificado de Apadrinamiento</h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant">Se deja constancia de que</p>
        <p className="font-headline-lg text-headline-lg-mobile text-on-surface">
          {protector.nombre} {protector.apellido}
        </p>
        <p className="font-body-lg text-body-lg text-on-surface-variant">es protector oficial de</p>

        <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-32 h-32 mx-auto rounded-full object-cover ring-4 ring-primary-fixed" />
        <p className="font-headline-lg text-headline-lg-mobile text-tertiary">{animal.nombre}</p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {animal.especie} · {animal.ubicacion}
        </p>

        <div className="flex flex-wrap justify-center gap-space-xl pt-space-md border-t border-outline-variant">
          <DatoCertificado titulo="Plan" valor={plan.nombre} />
          <DatoCertificado titulo="Protector desde" valor={formatearFecha(item.desde)} />
          <DatoCertificado titulo="N.º de certificado" valor={String(item.id).padStart(6, '0')} />
        </div>
      </div>
    </div>
  )
}

export default CertificadoImprimible