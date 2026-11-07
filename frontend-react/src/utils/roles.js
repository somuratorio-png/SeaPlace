// El backend llama 'duenioRefugio' al rol que en las pantallas es simplemente 'refugio'
export const rolDelFront = (nombreRol) => (nombreRol === 'duenioRefugio' ? 'refugio' : nombreRol)

// Cómo se presenta quien escribe un comentario, según su rol
const presentacionPorRol = {
  padrino: 'Protector del océano',
  refugio: 'Refugio',
  administrador: 'Equipo SeaPlace',
  patrocinador: 'Patrocinador',
}

export const presentacionDelRol = (rol) => presentacionPorRol[rol] || presentacionPorRol.padrino

export const esAdmin =(usuario) => usuario !== null && usuario.rol === 'administrador'
export const esRefugio = (usuario) => usuario !== null && usuario.rol === 'refugio'
export const esPatrocinador = (usuario) => usuario !== null && usuario.rol === 'patrocinador'
// Solo apadrinan los padrinos (y quien todavía no entró). Un patrocinador ayuda con campañas.
export const puedeApadrinar = (usuario) => !esAdmin(usuario) && !esRefugio(usuario) && !esPatrocinador(usuario)

// Color del círculo con la inicial y del desplegable de un usuario, según su rol
const coloresPorRol = {
  padrino: 'bg-primary-fixed text-on-primary-fixed-variant',
  refugio: 'bg-secondary-container text-on-secondary-fixed-variant',
  administrador: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  patrocinador: 'bg-tertiary-container text-on-tertiary-container',
}

// Si en el backend hay un rol que el front no conoce, se muestra con el color de padrino
export const colorDelRol = (rol) => coloresPorRol[rol] || coloresPorRol.padrino

// Para mostrar el nombre de un rol o permiso: "GESTIONAR_USUARIOS" se ve "GESTIONAR USUARIOS"
export const sinGuiones = (nombre) => nombre.replaceAll('_', ' ')