import { useCallback } from 'react'
import * as notificacionesApi from '../services/notificaciones'
import { useConsulta } from './useConsulta'

// Las notificaciones de quien está logueado, cuántas no leyó y la acción para marcarlas leídas.
// marcarLeidas avisa al backend y, si sale bien, las marca acá también (así el globito del menú desaparece).
// Las que recién se marcaron quedan con nueva: true, para seguir resaltándolas mientras se miran.
export const useNotificaciones = () => {
  const { datos: notificaciones, setDatos: setNotificaciones, cargando, error } = useConsulta(notificacionesApi.traerNotificaciones, undefined, [])

  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length

  const marcarLeidas = useCallback(() => {
    if (sinLeer === 0) {
      return
    }
    notificacionesApi
      .marcarLeidas()
      .then(() => {
        setNotificaciones((actuales) => actuales.map((notificacion) => ({ ...notificacion, nueva: !notificacion.leida, leida: true })))
      })
      // Si falla no pasa nada grave: siguen como no leídas y se vuelve a intentar la próxima vez que abra la sección
      .catch(() => {})
  }, [sinLeer, setNotificaciones])

  return { notificaciones, sinLeer, cargando, error, marcarLeidas }
}
