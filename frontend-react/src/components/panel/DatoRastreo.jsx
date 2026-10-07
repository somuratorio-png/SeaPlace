import Icono from '../comunes/Icono'

// Un dato en vivo del rastreo (velocidad, profundidad, etc.)
const DatoRastreo = ({ icono, titulo, valor }) => {
  return (
    <div className="bg-primary-fixed/60 rounded-xl p-space-md flex items-center gap-space-sm">
      <div className="w-10 h-10 shrink-0 rounded-full fondo-mar text-on-primary flex items-center justify-center">
        <Icono nombre={icono} clase="text-[20px]" />
      </div>
      <div>
        <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{titulo}</div>
        {/* tabular-nums evita que el texto "baile" cuando cambian los números */}
        <div className="font-title-lg text-title-lg text-primary tabular-nums">{valor}</div>
      </div>
    </div>
  )
}

export default DatoRastreo
