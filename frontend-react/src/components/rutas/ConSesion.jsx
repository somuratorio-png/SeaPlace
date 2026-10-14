import FormularioLogin from '../login/FormularioLogin'

// Si hay alguien logueado muestra la página; si no, muestra el login
const ConSesion = ({ usuario, onEntrar, children }) => {
  if (usuario !== null) {
    return children
  }
  return <FormularioLogin onEntrar={onEntrar} />
}

export default ConSesion