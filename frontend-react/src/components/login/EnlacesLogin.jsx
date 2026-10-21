import CredencialesDePrueba from './CredencialesDePrueba'

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