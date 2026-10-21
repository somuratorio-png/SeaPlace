export const esAdmin = (usuario) => usuario !== null && usuario.rol === 'administrador'
export const esRefugio = (usuario) => usuario !== null && usuario.rol === 'refugio'
// Solo apadrinan los padrinos (y quien todavía no entró)
export const puedeApadrinar = (usuario) => !esAdmin(usuario) && !esRefugio(usuario)

// Color del círculo con la inicial y del desplegable de un usuario, según su rol
const coloresPorRol = {
  padrino: 'bg-primary-fixed text-on-primary-fixed-variant',
  refugio: 'bg-secondary-container text-on-secondary-fixed-variant',
  administrador: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
}

// Si en el backend hay un rol que el front no conoce, se muestra con el color de padrino
export const colorDelRol = (rol) => coloresPorRol[rol] ?? coloresPorRol.padrino

// Para mostrar el nombre de un rol o permiso: "GESTIONAR_USUARIOS" se ve "GESTIONAR USUARIOS"
export const sinGuiones = (nombre) => nombre.replaceAll('_', ' ')