import MensajeError from '../comunes/MensajeError'

const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container'

const TarjetaFormularioAdmin = ({ titulo, textoBoton, error, onEnviar, children }) => {
  return (
    <form onSubmit={onEnviar} className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
      <h3 className="font-title-lg text-title-lg text-on-surface">{titulo}</h3>
      {children}
      {error && <MensajeError mensaje={error} />}
      <button type="submit" className={claseBoton}>
        {textoBoton}
      </button>
    </form>
  )
}

export default TarjetaFormularioAdmin