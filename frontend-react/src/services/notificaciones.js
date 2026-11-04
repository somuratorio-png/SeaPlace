// Conversor: una notificación del backend (NotificacionResponse) en el formato de los componentes.
// No le habla al backend: el pedido lo hace notificacionesSlice con axios.
// { id, texto, fecha: 'AAAA-MM-DD', leida }
export const aNotificacion = (dato) => ({ id: dato.idNotificacion, texto: dato.texto, fecha: dato.fecha.slice(0, 10), leida: dato.leida })
