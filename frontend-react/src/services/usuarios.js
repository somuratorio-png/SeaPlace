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
export const traerMiUsuario = async () => aUsuario(await pedir('/usuarios/me'))

export const ingresar = async (nombreUsuario, contrasenia) => {
  const respuesta = await pedir('/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } })
  guardarToken(respuesta.access_token)
  return traerMiUsuario()
}

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
export const registrar = async (datos, esRefugio) => {
  const respuesta = esRefugio
    ? await pedir('/auth/register-refugio', { metodo: 'POST', cuerpo: { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido } })
    : await pedir('/auth/register', { metodo: 'POST', cuerpo: datos })
  guardarToken(respuesta.access_token)
  return traerMiUsuario()
}

export const salir = () => {
  borrarToken()
}

// ---------- Mi cuenta ----------

// Cambia nombre, apellido y mail de quien está logueado. Devuelve el usuario ya modificado.
export const modificarMiPerfil = async ({ nombre, apellido, mail }) => aUsuario(await pedir('/usuarios/me', { metodo: 'PUT', cuerpo: { nombre, apellido, mail } }))

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = (contraseniaActual, contraseniaNueva) =>
  pedir('/usuarios/me/contrasenia', { metodo: 'PUT', cuerpo: { contraseniaActual, contraseniaNueva } })

// ---------- Olvidé mi contraseña ----------

// Pide un código de un solo uso para ese mail (vence a los 5 minutos). Devuelve el mensaje del backend,
// que es siempre el mismo exista o no el mail. No se manda un correo de verdad: el código sale
// impreso en la consola del servidor.
export const pedirCodigo = async (mail) => (await pedir('/auth/olvide-contrasenia', { metodo: 'POST', cuerpo: { mail } })).mensaje

export const restablecerContrasenia = (mail, codigo, contraseniaNueva) =>
  pedir('/auth/restablecer-contrasenia', { metodo: 'POST', cuerpo: { mail, codigo, contraseniaNueva } })

// ---------- Administración (solo las puede usar un administrador) ----------

export const traerUsuarios = async () => (await pedirPagina('/usuarios')).map(aUsuario)

// [{ id, nombre, permisos }] con el nombre que se usa en las pantallas.
// permisos = los nombres de los permisos que tiene el rol (el backend no manda el campo si no tiene ninguno)
export const traerRoles = async () =>
  (await pedirLista('/roles')).map((rol) => ({ id: rol.idRol, nombre: rolDelFront(rol.nombreRol), permisos: rol.permisos ?? [] }))

export const crearRol = (nombreRol) => pedir('/roles', { metodo: 'POST', cuerpo: { nombreRol } })

// [{ id, nombre, descripcion }]
export const traerPermisos = async () =>
  (await pedirLista('/permisos')).map((permiso) => ({ id: permiso.idPermiso, nombre: permiso.nombrePermiso, descripcion: permiso.descripcion ?? '' }))

export const crearPermiso = (nombrePermiso, descripcion) => pedir('/permisos', { metodo: 'POST', cuerpo: { nombrePermiso, descripcion } })

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = (idRol, idPermisos) => pedir(`/roles/${idRol}/permisos`, { metodo: 'POST', cuerpo: { idPermisos } })

export const cambiarRol = (idUsuario, idRol) => pedir(`/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } })

// No borra al usuario: lo deja inactivo
export const darDeBaja = (idUsuario) => pedir(`/usuarios/${idUsuario}`, { metodo: 'DELETE' })

export const reactivar = (idUsuario) => pedir(`/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' })

export const aprobarRefugio = (idRefugio) => pedir(`/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
