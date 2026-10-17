import FormularioContrasenia from './FormularioContrasenia'
import FormularioPerfil from './FormularioPerfil'
import Portada from '../comunes/Portada'
import { useSesion } from '../../hooks/useSesion'

// "Mi cuenta": el usuario logueado cambia sus datos y su contraseña.
// El nombre de usuario no se puede cambiar (es el que lleva el token), y el rol tampoco.
const PanelCuenta = () => {
  const { usuario } = useSesion()

  return (
    <>
      <Portada icono="manage_accounts" etiqueta="Mi cuenta" titulo={`${usuario.nombre} ${usuario.apellido}`} texto={`Usuario @${usuario.nombreUsuario} · cuenta de ${usuario.rol}`} />

      <div className="max-w-5xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
        <FormularioPerfil />
        <FormularioContrasenia />
      </div>
    </>
  )
}

export default PanelCuenta