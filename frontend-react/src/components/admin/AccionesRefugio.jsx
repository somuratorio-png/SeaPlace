import Icono from '../comunes/Icono'

const AccionesRefugio = ({ refugio, abierto, onAprobar, onAlternarAnimales, onCambiarActivo }) => {
  return (
    <div className="flex flex-wrap items-center gap-space-md">
      {!refugio.aprobado && (
        <button
          onClick={() => onAprobar(refugio.nombreUsuario)}
          className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-tertiary-container"
        >
          <Icono nombre="check" clase="text-[18px]" /> Aprobar
        </button>
      )}
      <button
        onClick={onAlternarAnimales}
        className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed-variant font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
      >
        <Icono nombre={abierto ? 'expand_less' : 'expand_more'} clase="text-[18px]" />
        {abierto ? 'Ocultar animales' : 'Ver animales'}
      </button>
      <button
        onClick={() => onCambiarActivo(refugio.nombreUsuario)}
        className={`font-label-lg text-label-lg px-space-md py-space-sm rounded-full ${refugio.activo ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'}`}
      >
        {refugio.activo ? 'Dar de baja' : 'Reactivar'}
      </button>
    </div>
  )
}

export default AccionesRefugio