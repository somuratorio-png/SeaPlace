import { usuariosIniciales } from '../data/usuarios'
import { esperar, guardarStorage, leerStorage } from './mock'

// Login y registro MOCKEADOS: no hay servidor. Los usuarios viven en localStorage.
// Las validaciones imitan las reglas del backend (usuario/mail repetido, credenciales incorrectas)
// para que la demo se comporte como la app real.
//
// ⚠ Solo para demo: guardar contraseñas en el navegador jamás se hace en una app real.

const KEY = 'seaplace_usuarios_mock'

function leerUsuarios() {
  return leerStorage(KEY, usuariosIniciales)
}

// Nunca devolvemos la contraseña a las páginas
function sinContrasenia({ contrasenia: _omitida, ...usuario }) {
  return usuario
}

export async function login(nombreUsuario, contrasenia) {
  await esperar()
  const usuario = leerUsuarios().find(
    (u) => u.nombreUsuario === nombreUsuario.trim() && u.contrasenia === contrasenia,
  )
  if (!usuario) throw new Error('Usuario o contraseña incorrectos')
  return sinContrasenia(usuario)
}

export async function register({ nombre, apellido, mail, nombreUsuario, contrasenia }) {
  await esperar()
  const usuarios = leerUsuarios()
  const nuevo = {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    mail: mail.trim().toLowerCase(),
    nombreUsuario: nombreUsuario.trim(),
    contrasenia,
  }

  if (contrasenia.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres')
  if (usuarios.some((u) => u.mail === nuevo.mail)) throw new Error(`Ya existe un usuario con el mail ${nuevo.mail}`)
  if (usuarios.some((u) => u.nombreUsuario === nuevo.nombreUsuario)) {
    throw new Error(`Ya existe un usuario con el nombre de usuario ${nuevo.nombreUsuario}`)
  }

  guardarStorage(KEY, [...usuarios, nuevo])
  return sinContrasenia(nuevo)
}
