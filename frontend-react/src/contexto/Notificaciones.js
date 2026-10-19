import { createContext } from 'react'

// Las notificaciones de quien está logueado, compartidas entre la campanita del header y el panel
// del refugio: así, al leerlas en un lado, el número de no leídas baja en los dos. Ver ProveedorNotificaciones.
export const ContextoNotificaciones = createContext(null)
