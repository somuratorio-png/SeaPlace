import { aAnimal } from './animales'
import { aApadrinamiento, aItem } from './apadrinar'
import { borrarToken, guardarToken, pedir } from './api'

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

// Pasa la sesión del backend (SesionResponse) al formato que usa App: quién entró y todo lo suyo.
// Llega con el pedido inicial (si había un token guardado) y en la respuesta del login y del registro.
// Lo que está vacío o no le corresponde a ese usuario no viene, y acá queda como [] (o sin muelle).
// favoritos = ids de animales. apadrinamientos = los que le corresponden: un padrino recibe los suyos,
// un refugio los de sus animales y un administrador todos. pausados = las publicaciones pausadas que
// puede ver. usuarios, roles y permisos solo los recibe un administrador.
export const aSesion = (dato) => ({
  usuario: aUsuario(dato.usuario),
  favoritos: (dato.favoritos ?? []).map((favorito) => favorito.idAnimal),
  muelle: { id: dato.idMuelle ?? null, items: (dato.itemsMuelle ?? []).map(aItem) },
  apadrinamientos: (dato.apadrinamientos ?? []).map(aApadrinamiento),
  pausados: (dato.pausados ?? []).map(aAnimal),
  usuarios: (dato.usuarios ?? []).map(aUsuario),
  roles: (dato.roles ?? []).map(aRol),
  permisos: (dato.permisos ?? []).map(aPermiso),
})

// Los dos devuelven la sesión de quien queda logueado. El token se guarda para los pedidos siguientes.

// La respuesta del login ya trae la sesión: no hace falta pedir nada más
const entrarCon = (respuesta) => {
  guardarToken(respuesta.access_token)
  return aSesion(respuesta.sesion)
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

// Un rol con el nombre que se usa en las pantallas. permisos = los nombres de los permisos
// que tiene (el backend no manda el campo si no tiene ninguno)
const aRol = (dato) => ({ id: dato.idRol, nombre: rolDelFront(dato.nombreRol), permisos: dato.permisos ?? [] })

const aPermiso = (dato) => ({ id: dato.idPermiso, nombre: dato.nombrePermiso, descripcion: dato.descripcion ?? '' })

// Las que crean o modifican algo devuelven lo que contestó el backend (el rol, el permiso o el
// usuario, ya en el formato de las pantallas): con eso se actualiza el estado sin volver a pedir la lista.
// Las listas de usuarios, roles y permisos llegan con la sesión del administrador (ver aSesion).

export const crearRol = (nombreRol) => pedir('/roles', { metodo: 'POST', cuerpo: { nombreRol } }).then(aRol)

export const crearPermiso = (nombrePermiso, descripcion) => pedir('/permisos', { metodo: 'POST', cuerpo: { nombrePermiso, descripcion } }).then(aPermiso)

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = (idRol, idPermisos) => pedir(`/roles/${idRol}/permisos`, { metodo: 'POST', cuerpo: { idPermisos } }).then(aRol)

export const cambiarRol = (idUsuario, idRol) => pedir(`/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } }).then(aUsuario)

// No borra al usuario: lo deja inactivo
export const darDeBaja = (idUsuario) => pedir(`/usuarios/${idUsuario}`, { metodo: 'DELETE' }).then(aUsuario)

export const reactivar = (idUsuario) => pedir(`/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' }).then(aUsuario)

export const aprobarRefugio = (idRefugio) => pedir(`/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
