import { useState } from 'react'
import Chip from './Chip'
import Modal from '../comunes/Modal'

// Lo que se puede hacer con un usuario en la tabla: nada si es uno mismo (se ve "Sos vos"),
// nada si es administrador (no se puede dar de baja), o dar de baja (con confirmación) / reactivar.
const AccionUsuario = ({ usuario, esUnoMismo, onCambiarActivo }) => {
  const [isVisible, setIsVisible] = useState(false)

  if (esUnoMismo) {
    return <Chip texto="Sos vos" tono="coral" />
  }
  if (usuario.rol === 'administrador') {
    return null
  }
  return (
    <>
      <button
        onClick={() => (usuario.activo ? setIsVisible(true) : onCambiarActivo(usuario.nombreUsuario))}
        className={`font-label-lg text-label-lg px-space-md py-1 rounded-full ${usuario.activo ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'}`}
      >
        {usuario.activo ? 'Dar de baja' : 'Reactivar'}
      </button>

      {isVisible && (
        <Modal
          titulo={`¿Dar de baja a @${usuario.nombreUsuario}?`}
          mensaje="La cuenta queda inactiva y no va a poder ingresar hasta que un administrador la reactive. Sus datos se conservan."
          textoConfirmar="Dar de baja"
          peligro={true}
          onConfirmar={() => {
            onCambiarActivo(usuario.nombreUsuario)
            setIsVisible(false)
          }}
          onCancelar={() => setIsVisible(false)}
        />
      )}
    </>
  )
}

export default AccionUsuario