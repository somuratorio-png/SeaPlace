import MensajeError from '../comunes/MensajeError'

const claseTarjeta = 'bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md'
const claseBoton = 'bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container disabled:opacity-60'
const claseExito = 'font-label-lg text-label-lg text-secondary'

const TarjetaFormularioCuenta = ({ titulo, textoBoton, textoExito, mostrarExito, error, onEnviar, children }) => {
  return (
    <form onSubmit={onEnviar} className={claseTarjeta}>
      <h2 className="font-headline-sm text-headline-sm text-primary">{titulo}</h2>
      {children}

      {error && <MensajeError mensaje={error} />}
      <div className="flex flex-wrap items-center gap-space-md">
        <button type="submit" className={claseBoton}>
          {textoBoton}
        </button>
        {mostrarExito && <span className={claseExito}>{textoExito}</span>}
      </div>
    </form>
  )
}

export default TarjetaFormularioCuenta