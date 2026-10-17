import Icono from '../comunes/Icono'

// Un número grande de la portada (por ejemplo "28 Especies Monitoreadas"). clase = colores de la tarjeta
const TarjetaEstadistica = ({ icono, valor, titulo, clase }) => {
  return (
    <div className={`revelar rounded-2xl p-space-lg shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${clase}`}>
      <Icono nombre={icono} clase="text-[32px]" />
      <div className="font-headline-lg text-headline-lg">{valor}</div>
      <div className="font-title-lg text-title-lg">{titulo}</div>
    </div>
  )
}

export default TarjetaEstadistica