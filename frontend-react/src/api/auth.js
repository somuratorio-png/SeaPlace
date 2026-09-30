import { apiFetch } from './client'

// POST /auth/authenticate  -> AuthenticationController.authenticate
export function login(nombreUsuario, contrasenia) {
  return apiFetch('/auth/authenticate', {
    method: 'POST',
    body: { nombreUsuario, contrasenia },
  })
}

// POST /auth/register  -> AuthenticationController.register
// Los nombres de los campos tienen que coincidir con RegisterRequest.java
export function register({ nombre, apellido, mail, nombreUsuario, contrasenia }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { nombre, apellido, mail, nombreUsuario, contrasenia },
  })
}
