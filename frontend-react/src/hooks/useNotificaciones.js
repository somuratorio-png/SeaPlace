import { useContext } from 'react'
import { ContextoNotificaciones } from '../contexto/Notificaciones'

export const useNotificaciones = () => useContext(ContextoNotificaciones)
