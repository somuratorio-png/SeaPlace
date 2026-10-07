import Icono from '../comunes/Icono'

// Lo que ve el usuario cuando su plan no incluye la ubicación en vivo
const RastreoBloqueado = ({ nombre }) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg text-center space-y-space-sm">
      <Icono nombre="lock" clase="text-on-surface-variant" />
      <h2 className="font-title-lg text-title-lg text-on-surface">Ubicación en vivo</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Seguir la ruta de {nombre} es un beneficio del plan Marea Profunda.
      </p>
    </div>
  )
}

export default RastreoBloqueado
