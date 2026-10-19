import { useContext } from 'react'
import { ContextoNotificaciones } from '../contexto/Notificaciones'

// { notificaciones, sinLeer, cargando, error, marcarLeidas }, ver ProveedorNotificaciones
export const useNotificaciones = () => useContext(ContextoNotificaciones)
