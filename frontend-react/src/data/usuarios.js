// Usuarios de ejemplo para el login (mock: no hay servidor).
// Los usuarios que se registran se agregan a esta lista mientras la página esté abierta.
// rol: 'padrino' | 'refugio' | 'administrador'. activo: false = dado de baja.

export const roles = ['padrino', 'refugio', 'administrador']

export const usuariosDeDemo = [
  {
    nombre: 'Marina',
    apellido: 'Delgado',
    mail: 'marina@seaplace.test',
    nombreUsuario: 'marina',
    contrasenia: 'foquita123',
    rol: 'padrino',
    activo: true,
  },
  {
    nombre: 'Admin',
    apellido: 'SeaPlace',
    mail: 'admin@seaplace.test',
    nombreUsuario: 'admin',
    contrasenia: 'admin1234',
    rol: 'administrador',
    activo: true,
  },
  {
    nombre: 'Tomás',
    apellido: 'Ibarra',
    mail: 'tomas@seaplace.test',
    nombreUsuario: 'tomas',
    contrasenia: 'nutria123',
    rol: 'padrino',
    activo: true,
  },
  {
    nombre: 'Refugio',
    apellido: 'Ensenada Salina',
    mail: 'ensenada@seaplace.test',
    nombreUsuario: 'ensenada',
    contrasenia: 'refugio123',
    rol: 'refugio',
    activo: true,
  },
  {
    nombre: 'Refugio',
    apellido: 'Pacífico Abierto',
    mail: 'pacifico@seaplace.test',
    nombreUsuario: 'pacifico',
    contrasenia: 'refugio123',
    rol: 'refugio',
    activo: true,
  },
]
