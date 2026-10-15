export const esAdmin = (usuario) => usuario !== null && usuario.rol === 'administrador'
export const esRefugio = (usuario) => usuario !== null && usuario.rol === 'refugio'
// Solo apadrinan los padrinos (y quien todavía no entró)
export const puedeApadrinar = (usuario) => !esAdmin(usuario) && !esRefugio(usuario)