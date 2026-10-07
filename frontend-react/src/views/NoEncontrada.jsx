import Icono from '../components/comunes/Icono'

// Página 404: se muestra cuando la dirección no coincide con ninguna ruta
const NoEncontrada = ({ onVolver }) => {
  return (
    <div className="max-w-2xl mx-auto px-margin-mobile py-space-xl text-center space-y-space-md">
      <div className="w-24 h-24 mx-auto rounded-full fondo-mar text-on-primary flex items-center justify-center shadow-lg">
        <Icono nombre="sailing" clase="text-[48px]" />
      </div>
      <p className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary">404</p>
      <h1 className="font-headline-md text-headline-md text-on-surface">Esta página se la llevó la marea</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">
        La dirección que buscás no existe o cambió de lugar. Volvé a la orilla y seguí desde ahí.
      </p>
      <button onClick={onVolver} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
        Volver al inicio
      </button>
    </div>
  )
}

export default NoEncontrada
