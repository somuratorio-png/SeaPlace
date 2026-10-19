import { aAnimal } from './animales'
import { aItem } from './apadrinar'
import { pedir, pedirLista, pedirPagina } from './api'

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

// Pasa la sesión del backend (SesionResponse) al formato que usa App: quién entró, sus favoritos
// (los animales que guardó) y su muelle. Es lo que hace falta en cualquier pantalla; el resto lo pide cada una.
// Llega con el pedido inicial (si había un token guardado) y en la respuesta del login y del registro.
// Lo que está vacío o no le corresponde a ese usuario no viene, y acá queda como [] (o sin muelle).
// "planes" hacen falta para armar los ítems del muelle (ver aItem).
export const aSesion = (planes, dato) => ({
  usuario: aUsuario(dato.usuario),
  favoritos: (dato.favoritos ?? []).map((favorito) => aAnimal(favorito.animal)),
  muelle: { id: dato.idMuelle ?? null, items: (dato.itemsMuelle ?? []).map((detalle) => aItem(planes, detalle)) },
})

// Los dos devuelven { token, sesion }: el token de quien queda logueado (ProveedorSesion lo guarda en su estado
// para los pedidos siguientes) y su sesión. La respuesta del login ya trae la sesión: no hace falta pedir nada más.
const entrarCon = (planes, respuesta) => ({ token: respuesta.access_token, sesion: aSesion(planes, respuesta.sesion) })

export const ingresar = (planes, nombreUsuario, contrasenia) =>
  pedir(null, '/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } }).then((respuesta) => entrarCon(planes, respuesta))

// datos = { nombre, apellido, mail, nombreUsuario, contrasenia }. Un refugio se registra por otra ruta,
// que además crea el refugio: no tiene nombre y apellido, así que se manda "Refugio" + su nombre.
export const registrar = (planes, datos, esRefugio) => {
  const pedido = esRefugio
    ? pedir(null, '/auth/register-refugio', { metodo: 'POST', cuerpo: { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido } })
    : pedir(null, '/auth/register', { metodo: 'POST', cuerpo: datos })
  return pedido.then((respuesta) => entrarCon(planes, respuesta))
}

// ---------- Mi cuenta ----------

// Cambia nombre, apellido y mail de quien está logueado. Devuelve el usuario ya modificado.
export const modificarMiPerfil = (token, { nombre, apellido, mail }) => pedir(token, '/usuarios/me', { metodo: 'PUT', cuerpo: { nombre, apellido, mail } }).then(aUsuario)

// Hay que mandar la contraseña actual: así nadie con la sesión abierta puede cambiarla
export const cambiarMiContrasenia = (token, contraseniaActual, contraseniaNueva) =>
  pedir(token, '/usuarios/me/contrasenia', { metodo: 'PUT', cuerpo: { contraseniaActual, contraseniaNueva } })

// ---------- Olvidé mi contraseña ----------

// Pide un código de un solo uso para ese mail (vence a los 5 minutos). Devuelve el mensaje del backend,
// que es siempre el mismo exista o no el mail. No se manda un correo de verdad: el código sale
// impreso en la consola del servidor.
export const pedirCodigo = (mail) => pedir(null, '/auth/olvide-contrasenia', { metodo: 'POST', cuerpo: { mail } }).then((respuesta) => respuesta.mensaje)

export const restablecerContrasenia = (mail, codigo, contraseniaNueva) =>
  pedir(null, '/auth/restablecer-contrasenia', { metodo: 'POST', cuerpo: { mail, codigo, contraseniaNueva } })

// ---------- Administración (solo las puede usar un administrador) ----------

export const traerUsuarios = (token) => pedirPagina(token, '/usuarios').then((usuarios) => usuarios.map(aUsuario))

// Un rol con el nombre que se usa en las pantallas. permisos = los nombres de los permisos
// que tiene (el backend no manda el campo si no tiene ninguno)
const aRol = (dato) => ({ id: dato.idRol, nombre: rolDelFront(dato.nombreRol), permisos: dato.permisos ?? [] })

const aPermiso = (dato) => ({ id: dato.idPermiso, nombre: dato.nombrePermiso, descripcion: dato.descripcion ?? '' })

// Las que crean o modifican algo devuelven lo que contestó el backend (el rol, el permiso o el
// usuario, ya en el formato de las pantallas): con eso se actualiza el estado sin volver a pedir la lista.

// [{ id, nombre, permisos }]
export const traerRoles = (token) => pedirLista(token, '/roles').then((roles) => roles.map(aRol))

export const crearRol = (token, nombreRol) => pedir(token, '/roles', { metodo: 'POST', cuerpo: { nombreRol } }).then(aRol)

// [{ id, nombre, descripcion }]
export const traerPermisos = (token) => pedirLista(token, '/permisos').then((permisos) => permisos.map(aPermiso))

export const crearPermiso = (token, nombrePermiso, descripcion) => pedir(token, '/permisos', { metodo: 'POST', cuerpo: { nombrePermiso, descripcion } }).then(aPermiso)

// Reemplaza todos los permisos del rol por los de la lista (ids)
export const asignarPermisos = (token, idRol, idPermisos) => pedir(token, `/roles/${idRol}/permisos`, { metodo: 'POST', cuerpo: { idPermisos } }).then(aRol)

export const cambiarRol = (token, idUsuario, idRol) => pedir(token, `/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } }).then(aUsuario)

// No borra al usuario: lo deja inactivo
export const darDeBaja = (token, idUsuario) => pedir(token, `/usuarios/${idUsuario}`, { metodo: 'DELETE' }).then(aUsuario)

export const reactivar = (token, idUsuario) => pedir(token, `/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' }).then(aUsuario)

export const aprobarRefugio = (token, idRefugio) => pedir(token, `/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
