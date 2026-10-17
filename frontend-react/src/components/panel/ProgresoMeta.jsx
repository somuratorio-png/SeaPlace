import BarraProgreso from '../comunes/BarraProgreso'

// Cuánto de la meta mensual del animal ya está cubierta
const ProgresoMeta = ({ progreso }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Cómo viene</h2>
      <p className="font-label-lg text-label-lg text-secondary">{progreso}% de la meta mensual cubierta</p>
      <BarraProgreso porcentaje={progreso} />
    </div>
  )
}

export default ProgresoMeta