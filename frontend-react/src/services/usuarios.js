import { borrarToken, guardarToken, pedir, pedirLista, pedirPagina } from './api'

// El backend llama 'duenioRefugio' al rol que en las pantallas es simplemente 'refugio'
const rolDelFront = (nombreRol) => (nombreRol === 'duenioRefugio' ? 'refugio' : nombreRol)

// Pasa un usuario del backend (UsuarioResponse) al formato que usan los componentes.
// aprobado solo importa para los refugios: false = todavía espera que un administrador lo apruebe.
const aUsuario = (dato) => ({
  id: dato.idUsuario,
  nombre: dato.nombre,
  apellido: dato.apellido,
  mail: dato.mail,
  nombreUsuario: dato.nombreUsuario,
  rol: rolDelFront(dato.nombreRol),
  activo: dato.activo,
  idRefugio: dato.idRefugio,
  aprobado: dato.refugioAprobado ?? true,
})

// ---------- Sesión ----------

// Los tres devuelven el usuario que queda logueado. El token se guarda para los pedidos siguientes.
export const traerMiUsuario = () => pedir('/usuarios/me').then(aUsuario)

// Con la respuesta del login se guarda el token y después se pide quién es el usuario
const entrarCon = (respuesta) => {
  guardarToken(respuesta.access_token)
  return traerMiUsuario()
}

export const ingresar = (nombreUsuario, contrasenia) =>
  pedir('/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } }).then(entrarCon)

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
export const registrar = (datos, esRefugio) => {
  const pedido = esRefugio
    ? pedir('/auth/register-refugio', { metodo: 'POST', cuerpo: { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido } })
    : pedir('/auth/register', { metodo: 'POST', cuerpo: datos })
  return pedido.then(entrarCon)
}

export const salir = () => {
  borrarToken()
}

// ---------- Mi cuenta ----------

// Cambia nombre, apellido y mail de quien está logueado. Devuelve el usuario ya modificado.
export const modificarMiPerfil = ({ nombre, apellido, mail }) => pedir('/usuarios/me', { metodo: 'PUT', cuerpo: { nombre, apellido, mail } }).then(aUsuario)

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = (contraseniaActual, contraseniaNueva) =>
  pedir('/usuarios/me/contrasenia', { metodo: 'PUT', cuerpo: { contraseniaActual, contraseniaNueva } })

// ---------- Olvidé mi contraseña ----------

// Pide un código de un solo uso para ese mail (vence a los 5 minutos). Devuelve el mensaje del backend,
// que es siempre el mismo exista o no el mail. No se manda un correo de verdad: el código sale
// impreso en la consola del servidor.
export const pedirCodigo = (mail) => pedir('/auth/olvide-contrasenia', { metodo: 'POST', cuerpo: { mail } }).then((respuesta) => respuesta.mensaje)

export const restablecerContrasenia = (mail, codigo, contraseniaNueva) =>
  pedir('/auth/restablecer-contrasenia', { metodo: 'POST', cuerpo: { mail, codigo, contraseniaNueva } })

// ---------- Administración (solo las puede usar un administrador) ----------

export const traerUsuarios = () => pedirPagina('/usuarios').then((usuarios) => usuarios.map(aUsuario))

// [{ id, nombre, permisos }] con el nombre que se usa en las pantallas.
// permisos = los nombres de los permisos que tiene el rol (el backend no manda el campo si no tiene ninguno)
export const traerRoles = () =>
  pedirLista('/roles').then((roles) => roles.map((rol) => ({ id: rol.idRol, nombre: rolDelFront(rol.nombreRol), permisos: rol.permisos ?? [] })))

export const crearRol = (nombreRol) => pedir('/roles', { metodo: 'POST', cuerpo: { nombreRol } })

// [{ id, nombre, descripcion }]
export const traerPermisos = () =>
  pedirLista('/permisos').then((permisos) =>
    permisos.map((permiso) => ({ id: permiso.idPermiso, nombre: permiso.nombrePermiso, descripcion: permiso.descripcion ?? '' })),
  )

export const crearPermiso = (nombrePermiso, descripcion) => pedir('/permisos', { metodo: 'POST', cuerpo: { nombrePermiso, descripcion } })

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = (idRol, idPermisos) => pedir(`/roles/${idRol}/permisos`, { metodo: 'POST', cuerpo: { idPermisos } })

export const cambiarRol = (idUsuario, idRol) => pedir(`/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } })

// No borra al usuario: lo deja inactivo
export const darDeBaja = (idUsuario) => pedir(`/usuarios/${idUsuario}`, { metodo: 'DELETE' })

export const reactivar = (idUsuario) => pedir(`/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' })

export const aprobarRefugio = (idRefugio) => pedir(`/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
