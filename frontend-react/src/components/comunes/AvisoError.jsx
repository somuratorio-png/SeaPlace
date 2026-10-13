import Icono from './Icono'

// Cartel con el mensaje de un pedido al backend que falló. onCerrar es opcional: si se pasa, aparece el botón.
const AvisoError = ({ mensaje, onCerrar }) => {
  return (
    <div role="alert" className="bg-error-container text-on-error-container rounded-2xl px-space-lg py-space-md flex items-center justify-between gap-space-md shadow-sm">
      <span className="inline-flex items-center gap-space-sm font-body-md text-body-md">
        <Icono nombre="error" clase="text-[20px]" /> {mensaje}
      </span>
      {onCerrar && (
        <button onClick={onCerrar} className="font-label-lg text-label-lg underline">
          Cerrar
        </button>
      )}
    </div>
  )
}

export default AvisoError
