// Lo que va debajo de los planes: el botón para apadrinar, o el motivo por el que no se puede
// (la cuenta es de administrador o de refugio, o al animal no le quedan cupos).
const AccionApadrinar = ({ animal, puedeApadrinar, sinCupos, onApadrinar }) => {
  if (!puedeApadrinar) {
    return (
      <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-center">
        Las cuentas de administrador y de refugio no pueden apadrinar.
      </p>
    )
  }
  if (sinCupos) {
    return (
      <p className="bg-surface-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-center text-on-surface-variant">
        {animal.nombre} ya tiene todos sus cupos tomados. Guardalo en favoritos para volver más adelante.
      </p>
    )
  }
  return (
    <button onClick={onApadrinar} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-space-md rounded-full hover:bg-tertiary-container">
      Apadrinar a {animal.nombre}
    </button>
  )
}

export default AccionApadrinar