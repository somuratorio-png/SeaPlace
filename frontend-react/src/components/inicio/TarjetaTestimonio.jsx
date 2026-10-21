import Icono from '../comunes/Icono'

const TarjetaTestimonio = ({ nombre, rol, texto }) => {
  return (
    <div className="revelar bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm border-t-4 transition hover:-translate-y-1 hover:shadow-lg border-tertiary-fixed-dim">
      <Icono nombre="format_quote" clase="text-tertiary text-[32px]" />
      <p className="font-body-md text-body-md text-on-surface italic">"{texto}"</p>
      <div>
        <span className="font-title-lg text-title-lg text-primary block">{nombre}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{rol}</span>
      </div>
    </div>
  )
}

export default TarjetaTestimonio