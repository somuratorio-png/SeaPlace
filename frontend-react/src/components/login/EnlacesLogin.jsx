import CredencialesDePrueba from './CredencialesDePrueba'

// Lo que va debajo del botón de enviar en el login: cambiar entre ingresar y registrarse y, solo al ingresar,
// "olvidé mi contraseña" y los usuarios de prueba.
const EnlacesLogin = ({ esRegistro, onCambiarModo, onRecuperar }) => {
  return (
    <>
      <button type="button" onClick={onCambiarModo} className="w-full font-label-lg text-label-lg text-secondary hover:underline">
        {esRegistro ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
      </button>

      {!esRegistro && (
        <button type="button" onClick={onRecuperar} className="w-full font-label-lg text-label-lg text-on-surface-variant hover:underline">
          ¿Olvidaste tu contraseña?
        </button>
      )}

      {!esRegistro && <CredencialesDePrueba />}
    </>
  )
}

export default EnlacesLogin