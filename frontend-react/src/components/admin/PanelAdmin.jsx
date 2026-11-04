import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SeccionesAdmin from './SeccionesAdmin'
import AvisoError from '../comunes/AvisoError'
import EstadoCarga from '../comunes/EstadoCarga'
import Portada from '../comunes/Portada'
import { darDeBaja, reactivar, traerUsuarios } from '../../Redux/usuariosSlice'
import { intentar } from '../../utils/intentar'

// Panel del administrador. Esta página pide al montarse los usuarios, que usan el menú (el aviso de
// refugios pendientes) y varias secciones. Las demás listas las pide SeccionesAdmin.
// Cada acción llama al backend y, con lo que contesta, se actualiza el estado global: la lista no se vuelve a pedir.
// Si una acción falla, el mensaje se muestra arriba de la página.
const PanelAdmin = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { items: usuarios, loading, error } = useSelector((state) => state.usuarios)
  // false hasta que termina el pedido de los usuarios. Sin esto, en el primer render (antes del "pending")
  // se montarían las secciones, despacharían sus pedidos, se desmontarían al pasar a "cargando" y los
  // volverían a despachar al terminar.
  const [listo, setListo] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló
  const cargando = loading || !listo

  useEffect(() => {
    dispatch(traerUsuarios()).then(() => {
      setListo(true)
    })
  }, [dispatch])

  // Da de baja a un usuario activo, o reactiva a uno dado de baja. La usan dos secciones.
  const cambiarActivo = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    setErrorAccion(null)
    intentar(dispatch(elegido.activo ? darDeBaja(elegido.id) : reactivar(elegido.id)), setErrorAccion)
  }

  const elegirContenido = () => {
    if (cargando || error) {
      return <EstadoCarga cargando={cargando} error={error} texto="Cargando el panel…" />
    }

    return <SeccionesAdmin onCambiarActivo={cambiarActivo} onError={setErrorAccion} />
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
