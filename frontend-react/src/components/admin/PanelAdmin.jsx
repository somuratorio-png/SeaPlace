import { useState } from 'react'
import SeccionesAdmin from './SeccionesAdmin'
import AvisoError from '../comunes/AvisoError'
import EstadoCarga from '../comunes/EstadoCarga'
import Portada from '../comunes/Portada'
import * as usuariosApi from '../../services/usuarios'
import { ponerEn } from '../../utils/listas'
import { useSesion } from '../../hooks/useSesion'
import { useConsulta } from '../../hooks/useConsulta'

const PanelAdmin = () => {
  const { usuario, token } = useSesion()
  const { datos: usuarios, setDatos: setUsuarios, cargando, error } = useConsulta(usuariosApi.traerUsuarios, undefined, [])
  const [errorAccion, setErrorAccion] = useState(null)

  const guardarUsuario = (cambiado) => {
    setUsuarios((actuales) => ponerEn(actuales, cambiado))
  }

  const cambiarActivo = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    const pedido = elegido.activo ? usuariosApi.darDeBaja(token, elegido.id) : usuariosApi.reactivar(token, elegido.id)
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