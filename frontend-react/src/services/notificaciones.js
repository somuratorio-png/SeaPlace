import { pedir, pedirLista } from './api'

const aNotificacion = (dato) => ({ id: dato.idNotificacion, texto: dato.texto, fecha: dato.fecha.slice(0, 10), leida: dato.leida })

export const traerNotificaciones = (token) => pedirLista(token, '/notificaciones').then((lista) => lista.map(aNotificacion))

export const marcarLeidas = (token) => pedir(token, '/notificaciones/leidas', { metodo: 'PUT' })
