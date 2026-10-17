import { useState } from 'react'
import SeccionesAdmin from './SeccionesAdmin'
import AvisoError from '../comunes/AvisoError'
import EstadoCarga from '../comunes/EstadoCarga'
import Portada from '../comunes/Portada'
import * as usuariosApi from '../../services/usuarios'
import { ponerEn } from '../../utils/listas'
import { useSesion } from '../../hooks/useSesion'
import { useConsulta } from '../../hooks/useConsulta'

// Panel del administrador. Esta página pide al montarse los usuarios, que usan el menú (el aviso de
// refugios pendientes) y varias secciones. Lo demás lo pide cada sección cuando se abre: sus animales,
// sus roles, sus categorías...
// Cada acción llama al backend y, con lo que contesta, actualiza el estado: la lista no se vuelve a pedir.
// Si una acción falla, el mensaje se muestra arriba de la página.
const PanelAdmin = () => {
  const { usuario } = useSesion()
  const { datos: usuarios, setDatos: setUsuarios, cargando, error } = useConsulta(usuariosApi.traerUsuarios, undefined, [])
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // Pone en la lista al usuario como lo devolvió el backend
  const guardarUsuario = (cambiado) => {
    setUsuarios((actuales) => ponerEn(actuales, cambiado))
  }

  // Da de baja a un usuario activo, o reactiva a uno dado de baja. La usan dos secciones.
  // Devuelve una promesa con el usuario como quedó, o null si el pedido falló.
  const cambiarActivo = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    const pedido = elegido.activo ? usuariosApi.darDeBaja(elegido.id) : usuariosApi.reactivar(elegido.id)
    setErrorAccion(null)
    return pedido
      .then((cambiado) => {
        guardarUsuario(cambiado)
        return cambiado
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
        return null
      })
  }

  const elegirContenido = () => {
    if (cargando || error) {
      return <EstadoCarga cargando={cargando} error={error} texto="Cargando el panel…" />
    }

    return <SeccionesAdmin usuarios={usuarios} onCambiarActivo={cambiarActivo} onGuardarUsuario={guardarUsuario} onError={setErrorAccion} />
  }

  return (
    <>
      <Portada
        icono="admin_panel_settings"
        etiqueta="Panel de administración"
        titulo={`Hola, ${usuario.nombre}`}
        texto="Desde acá controlás los refugios, sus animales y las cuentas de SeaPlace."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
        {elegirContenido()}
      </div>
    </>
  )
}

export default PanelAdmin