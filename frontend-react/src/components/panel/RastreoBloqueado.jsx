import Icono from '../comunes/Icono'

// Lo que ve el usuario cuando su plan no incluye la ubicación en vivo
const RastreoBloqueado = ({ nombre }) => {
  return (
    <div className="fondo-mar text-on-primary relative overflow-hidden rounded-2xl shadow-md p-space-xl text-center space-y-space-sm">
      <span className="burbuja w-24 h-24 -left-6 -top-6" />
      <span className="burbuja w-14 h-14 right-8 bottom-4" style={{ animationDelay: '3s' }} />

      <div className="relative w-16 h-16 mx-auto rounded-full bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
        <Icono nombre="lock" clase="text-[32px]" />
      </div>
      <h2 className="relative font-headline-sm text-headline-sm">Ubicación en vivo</h2>
      <p className="relative font-body-md text-body-md text-primary-fixed max-w-md mx-auto">
        Seguir la ruta de {nombre} por el mapa es un beneficio del plan Marea Profunda.
      </p>
    </div>
  )
}

export default RastreoBloqueado
