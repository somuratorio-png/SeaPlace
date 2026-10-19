import { useCallback, useEffect, useState } from 'react'
import { ContextoNotificaciones } from '../../contexto/Notificaciones'
import * as notificacionesApi from '../../services/notificaciones'
import { useSesion } from '../../hooks/useSesion'

const ProveedorNotificaciones = ({ children }) => {
  const { usuario } = useSesion()
  const idUsuario = usuario ? usuario.id : null
  const [notificaciones, setNotificaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null) // si no se pudieron traer
  const [errorAlMarcar, setErrorAlMarcar] = useState(null) // si no se pudieron marcar como leídas

  // Un solo pedido cuando alguien entra (y otro solo si después entra otro usuario).
  // Si cierra la sesión mientras se espera la respuesta, esa respuesta ya no se usa.
  useEffect(() => {
    if (idUsuario === null) {
      return
    }
    let vigente = true

    notificacionesApi
      .traerNotificaciones()
      .then((lista) => {
        if (vigente) {
          setNotificaciones(lista)
        }
      })
      .catch((falla) => {
        if (vigente) {
          setError(falla.message)
        }
      })
      .then(() => {
        if (vigente) {
          setCargando(false)
        }
      })

    return () => {
      vigente = false
      setNotificaciones([])
      setCargando(true)
      setError(null)
      setErrorAlMarcar(null)
    }
  }, [idUsuario])

  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length

  // Avisa al backend y, si sale bien, las marca acá también (sin volver a pedirlas). Las que recién se
  // marcaron quedan con nueva: true, para seguir resaltándolas mientras se miran.
  // Si falla, el mensaje queda en errorAlMarcar para mostrarlo.
  const marcarLeidas = useCallback(() => {
    if (sinLeer === 0) {
      return
    }
    setErrorAlMarcar(null)
    notificacionesApi
      .marcarLeidas()
      .then(() => {
        setNotificaciones((actuales) => actuales.map((notificacion) => ({ ...notificacion, nueva: !notificacion.leida, leida: true })))
      })
      .catch((falla) => {
        setErrorAlMarcar(falla.message)
      })
  }, [sinLeer])

  const valor = { notificaciones, sinLeer, cargando, error, errorAlMarcar, marcarLeidas }

  return <ContextoNotificaciones.Provider value={valor}>{children}</ContextoNotificaciones.Provider>
}

export default ProveedorNotificaciones
