import Chip from './Chip'

// Lo que se puede hacer con un usuario en la tabla: nada si es uno mismo (se ve "Sos vos"),
// nada si es administrador (no se puede dar de baja), o dar de baja / reactivar.
const AccionUsuario = ({ usuario, esUnoMismo, onCambiarActivo }) => {
  if (esUnoMismo) {
    return <Chip texto="Sos vos" tono="coral" />
  }
  if (usuario.rol === 'administrador') {
    return null
  }
  return (
    <button
      onClick={() => onCambiarActivo(usuario.nombreUsuario)}
      className={`font-label-lg text-label-lg px-space-md py-1 rounded-full ${usuario.activo ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'}`}
    >
      {usuario.activo ? 'Dar de baja' : 'Reactivar'}
    </button>
  )
}

export default AccionUsuario