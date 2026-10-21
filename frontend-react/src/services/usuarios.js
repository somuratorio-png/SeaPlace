import { aAnimal } from './animales'
import { aItem } from './apadrinar'
import { pedir, pedirLista, pedirPagina } from './api'

const rolDelFront = (nombreRol) => (nombreRol === 'duenioRefugio' ? 'refugio' : nombreRol)

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

export const aSesion = (planes, dato) => ({
  usuario: aUsuario(dato.usuario),
  favoritos: (dato.favoritos ?? []).map((favorito) => aAnimal(favorito.animal)),
  muelle: { id: dato.idMuelle ?? null, items: (dato.itemsMuelle ?? []).map((detalle) => aItem(planes, detalle)) },
})

const entrarCon = (planes, respuesta) => ({ token: respuesta.access_token, sesion: aSesion(planes, respuesta.sesion) })

export const ingresar = (planes, nombreUsuario, contrasenia) =>
  pedir(null, '/auth/authenticate', { metodo: 'POST', cuerpo: { nombreUsuario, contrasenia } }).then((respuesta) => entrarCon(planes, respuesta))

export const registrar = (planes, datos, esRefugio) => {
  const pedido = esRefugio
    ? pedir(null, '/auth/register-refugio', { metodo: 'POST', cuerpo: { ...datos, nombre: 'Refugio', nombreRefugio: datos.apellido } })
    : pedir(null, '/auth/register', { metodo: 'POST', cuerpo: datos })
  return pedido.then((respuesta) => entrarCon(planes, respuesta))
}

export const modificarMiPerfil = (token, { nombre, apellido, mail }) => pedir(token, '/usuarios/me', { metodo: 'PUT', cuerpo: { nombre, apellido, mail } }).then(aUsuario)

export const cambiarMiContrasenia = (token, contraseniaActual, contraseniaNueva) =>
  pedir(token, '/usuarios/me/contrasenia', { metodo: 'PUT', cuerpo: { contraseniaActual, contraseniaNueva } })

export const pedirCodigo = (mail) => pedir(null, '/auth/olvide-contrasenia', { metodo: 'POST', cuerpo: { mail } }).then((respuesta) => respuesta.mensaje)

export const restablecerContrasenia = (mail, codigo, contraseniaNueva) =>
  pedir(null, '/auth/restablecer-contrasenia', { metodo: 'POST', cuerpo: { mail, codigo, contraseniaNueva } })

export const traerUsuarios = (token) => pedirPagina(token, '/usuarios').then((usuarios) => usuarios.map(aUsuario))

const aRol = (dato) => ({ id: dato.idRol, nombre: rolDelFront(dato.nombreRol), permisos: dato.permisos ?? [] })

const aPermiso = (dato) => ({ id: dato.idPermiso, nombre: dato.nombrePermiso, descripcion: dato.descripcion ?? '' })

export const traerRoles = (token) => pedirLista(token, '/roles').then((roles) => roles.map(aRol))

export const crearRol = (token, nombreRol) => pedir(token, '/roles', { metodo: 'POST', cuerpo: { nombreRol } }).then(aRol)

export const traerPermisos = (token) => pedirLista(token, '/permisos').then((permisos) => permisos.map(aPermiso))

export const crearPermiso = (token, nombrePermiso, descripcion) => pedir(token, '/permisos', { metodo: 'POST', cuerpo: { nombrePermiso, descripcion } }).then(aPermiso)

export const asignarPermisos = (token, idRol, idPermisos) => pedir(token, `/roles/${idRol}/permisos`, { metodo: 'POST', cuerpo: { idPermisos } }).then(aRol)

export const cambiarRol = (token, idUsuario, idRol) => pedir(token, `/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } }).then(aUsuario)

export const darDeBaja = (token, idUsuario) => pedir(token, `/usuarios/${idUsuario}`, { metodo: 'DELETE' }).then(aUsuario)

export const reactivar = (token, idUsuario) => pedir(token, `/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' }).then(aUsuario)

export const aprobarRefugio = (token, idRefugio) => pedir(token, `/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
