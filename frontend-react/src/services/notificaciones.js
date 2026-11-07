// Conversor: una notificación del backend (NotificacionResponse) en el formato de los componentes.
// No le habla al backend: el pedido lo hace notificacionesSlice con axios.
// { id, texto, fecha: 'AAAA-MM-DD', leida, tema }
export const aNotificacion = (dato) => ({ id: dato.idNotificacion, texto: dato.texto, fecha: dato.fecha.slice(0, 10), leida: dato.leida, tema: dato.tema || 'GENERAL' })

// Los temas en los que se agrupan, en el orden en que se muestran (ver TemaNotificacion en el backend)
export const temas = [
  { codigo: 'COMENTARIOS', nombre: 'Comentarios', icono: 'forum' },
  { codigo: 'PATROCINIOS', nombre: 'Patrocinios', icono: 'handshake' },
  { codigo: 'PUBLICACIONES', nombre: 'Publicaciones', icono: 'pending_actions' },
  { codigo: 'NOVEDADES', nombre: 'Novedades', icono: 'edit_note' },
  { codigo: 'APADRINADOS', nombre: 'Tus apadrinados', icono: 'pets' },
  { codigo: 'GENERAL', nombre: 'Otras', icono: 'notifications' },
]

export const temaDe = (codigo) => temas.find((tema) => tema.codigo === codigo) || temas[temas.length - 1]

// Los temas que tienen alguna notificación, con cuántas hay y cuántas son nuevas
export const temasPresentes = (notificaciones) =>
  temas
    .map((tema) => {
      const delTema = notificaciones.filter((notificacion) => notificacion.tema === tema.codigo)
      return { ...tema, cantidad: delTema.length, nuevas: delTema.filter((notificacion) => notificacion.nueva || !notificacion.leida).length }
    })
    .filter((tema) => tema.cantidad > 0)
