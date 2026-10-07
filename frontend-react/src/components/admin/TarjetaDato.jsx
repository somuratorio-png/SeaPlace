import Icono from '../comunes/Icono'

// Número grande del resumen del administrador. clase = colores de fondo y de texto de la tarjeta
const TarjetaDato = ({ icono, valor, titulo, clase }) => {
  return (
    <div className={`rounded-xl p-space-lg shadow-sm ${clase}`}>
      <Icono nombre={icono} clase="text-[28px]" />
      <div className="font-headline-lg text-headline-lg">{valor}</div>
      <div className="font-label-lg text-label-lg">{titulo}</div>
    </div>
  )
}

export default TarjetaDato
