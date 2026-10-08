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

// ---------- Administración (solo las puede usar un administrador) ----------

export const traerUsuarios = async () => (await pedirPagina('/usuarios')).map(aUsuario)

// [{ id, nombre }] con el nombre que se usa en las pantallas
export const traerRoles = async () => (await pedirLista('/roles')).map((rol) => ({ id: rol.idRol, nombre: rolDelFront(rol.nombreRol) }))

export const cambiarRol = (idUsuario, idRol) => pedir(`/usuarios/${idUsuario}/rol`, { metodo: 'PUT', cuerpo: { idRol } })

// No borra al usuario: lo deja inactivo
export const darDeBaja = (idUsuario) => pedir(`/usuarios/${idUsuario}`, { metodo: 'DELETE' })

export const reactivar = (idUsuario) => pedir(`/usuarios/${idUsuario}/reactivar`, { metodo: 'PUT' })

export const aprobarRefugio = (idRefugio) => pedir(`/refugios/${idRefugio}/aprobar`, { metodo: 'PUT' })
