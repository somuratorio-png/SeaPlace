import { rolDelFront } from '../utils/roles'

// Conversor de los comentarios. No le habla al backend: los pedidos los hacen los slices de src/Redux con axios.

// Un comentario: { id, idUsuario, autor, rol, texto, fecha: 'AAAA-MM-DD', idNovedad }.
// idUsuario = quien lo escribió (para saber si es propio). idNovedad = null si es un comentario de la página.
export const aComentario = (dato) => ({
  id: dato.idComentario,
  idUsuario: dato.idUsuario,
  autor: dato.autor,
  rol: rolDelFront(dato.nombreRol),
  texto: dato.texto,
  fecha: dato.fecha.slice(0, 10),
  idNovedad: dato.idNovedad || null,
})

// Lo puede borrar quien lo escribió o un administrador (la misma regla que el backend)
export const puedeBorrar = (usuario, comentario) =>
  usuario !== null && (usuario.rol === 'administrador' || usuario.id === comentario.idUsuario)
