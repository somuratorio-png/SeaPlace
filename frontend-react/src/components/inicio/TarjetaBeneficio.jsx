import Icono from '../comunes/Icono'

// Un beneficio del kit del protector: ícono, título y descripción
const TarjetaBeneficio = ({ icono, titulo, texto }) => {
  return (
    <div className="revelar bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="w-14 h-14 rounded-full fondo-mar text-on-primary flex items-center justify-center">
        <Icono nombre={icono} clase="text-[28px]" />
      </div>
      <h3 className="font-title-lg text-title-lg text-primary">{titulo}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{texto}</p>
    </div>
  )
}

export default TarjetaBeneficio