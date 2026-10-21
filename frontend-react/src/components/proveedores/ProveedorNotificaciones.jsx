import { useCallback, useEffect, useState } from 'react'
import { ContextoNotificaciones } from '../../contexto/Notificaciones'
import * as notificacionesApi from '../../services/notificaciones'
import { useSesion } from '../../hooks/useSesion'

const ProveedorNotificaciones = ({ children }) => {
  const { usuario, token } = useSesion()
  const idUsuario = usuario ? usuario.id : null
  const [notificaciones, setNotificaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [errorAlMarcar, setErrorAlMarcar] = useState(null)

  useEffect(() => {
    if (idUsuario === null) {
      return
    }
    let vigente = true

    notificacionesApi
      .traerNotificaciones(token)
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
  }, [idUsuario, token])

  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length

  const marcarLeidas = useCallback(() => {
    if (sinLeer === 0) {
      return
    }
    setErrorAlMarcar(null)
    notificacionesApi
      .marcarLeidas(token)
      .then(() => {
        setNotificaciones((actuales) => actuales.map((notificacion) => ({ ...notificacion, nueva: !notificacion.leida, leida: true })))
      })
      .catch((falla) => {
        setErrorAlMarcar(falla.message)
      })
  }, [sinLeer, token])

  const valor = { notificaciones, sinLeer, cargando, error, errorAlMarcar, marcarLeidas }

  return <ContextoNotificaciones.Provider value={valor}>{children}</ContextoNotificaciones.Provider>
}

export default ProveedorNotificaciones
