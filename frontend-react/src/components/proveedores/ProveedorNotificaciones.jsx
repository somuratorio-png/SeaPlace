import { useCallback, useEffect, useState } from 'react'
import { ContextoNotificaciones } from '../../contexto/Notificaciones'
import * as notificacionesApi from '../../services/notificaciones'
import { useSesion } from '../../hooks/useSesion'

// Cada cuánto se vuelven a pedir al backend, para que las nuevas aparezcan sin recargar la página
const CADA_CUANTO = 60000

const ProveedorNotificaciones = ({ children }) => {
  const { usuario } = useSesion()
  const idUsuario = usuario ? usuario.id : null
  const [notificaciones, setNotificaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Al entrar (y cada minuto mientras siga logueado) se piden las suyas.
  // Las que recién se leyeron conservan la marca "nueva" al volver a pedirlas.
  useEffect(() => {
    if (idUsuario === null) {
      return
    }
    let vigente = true // deja de valer si cierra la sesión o entra otro usuario mientras se espera la respuesta

    const traer = () =>
      notificacionesApi
        .traerNotificaciones()
        .then((lista) => {
          if (!vigente) {
            return
          }
          setNotificaciones((actuales) => lista.map((notificacion) => ({ ...notificacion, nueva: actuales.find((otra) => otra.id === notificacion.id)?.nueva ?? false })))
          setError(null)
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

    traer()
    const intervalo = setInterval(traer, CADA_CUANTO)
    return () => {
      vigente = false
      clearInterval(intervalo)
      setNotificaciones([])
      setCargando(true)
    }
  }, [idUsuario])

  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length

  // Avisa al backend y, si sale bien, las marca acá también. Las que recién se marcaron quedan con
  // nueva: true, para seguir resaltándolas mientras se miran.
  const marcarLeidas = useCallback(() => {
    if (sinLeer === 0) {
      return
    }
    notificacionesApi
      .marcarLeidas()
      .then(() => {
        setNotificaciones((actuales) => actuales.map((notificacion) => ({ ...notificacion, nueva: notificacion.nueva || !notificacion.leida, leida: true })))
      })
      // Si falla no pasa nada grave: siguen como no leídas y se vuelve a intentar la próxima vez que las abra
      .catch(() => {})
  }, [sinLeer])

  const valor = { notificaciones, sinLeer, cargando, error, marcarLeidas }

  return <ContextoNotificaciones.Provider value={valor}>{children}</ContextoNotificaciones.Provider>
}

export default ProveedorNotificaciones
