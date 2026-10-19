import { pedir, pedirLista } from './api'

// Una notificación del backend (NotificacionResponse) en el formato de los componentes:
// { id, texto, fecha: 'AAAA-MM-DD', leida }
const aNotificacion = (dato) => ({ id: dato.idNotificacion, texto: dato.texto, fecha: dato.fecha.slice(0, 10), leida: dato.leida })

// Las de quien está logueado, de la más nueva a la más vieja
export const traerNotificaciones = () => pedirLista('/notificaciones').then((lista) => lista.map(aNotificacion))

// Las marca todas como leídas
export const marcarLeidas = () => pedir('/notificaciones/leidas', { metodo: 'PUT' })
