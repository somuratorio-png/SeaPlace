import { aAnimal } from './animales'
import { aItem } from './apadrinar'

// Conversores de usuarios, sesión, roles y permisos.
// No le hablan al backend: los pedidos los hacen los slices de src/Redux con axios.

// El backend llama 'duenioRefugio' al rol que en las pantallas es simplemente 'refugio'
const rolDelFront = (nombreRol) => (nombreRol === 'duenioRefugio' ? 'refugio' : nombreRol)

// Pasa un usuario del backend (UsuarioResponse) al formato que usan los componentes.
// aprobado solo importa para los refugios: false = todavía espera que un administrador lo apruebe.
export const aUsuario = (dato) => ({
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

// Pasa la sesión del backend (SesionResponse) al formato de los slices: quién entró, sus favoritos
// (los animales que guardó) y su muelle. Llega en la respuesta del login y del registro.
// Lo que está vacío o no le corresponde a ese usuario no viene, y acá queda como [] (o sin muelle).
// "planes" hacen falta para armar los ítems del muelle (ver aItem).
export const aSesion = (planes, dato) => ({
  usuario: aUsuario(dato.usuario),
  favoritos: (dato.favoritos ?? []).map((favorito) => aAnimal(favorito.animal)),
  muelle: { id: dato.idMuelle ?? null, items: (dato.itemsMuelle ?? []).map((detalle) => aItem(planes, detalle)) },
})

// La respuesta del login y del registro: { token, sesion }. El token lo guarda usuarioSlice
// para mandarlo en los pedidos siguientes.
export const entrarCon = (planes, respuesta) => ({ token: respuesta.access_token, sesion: aSesion(planes, respuesta.sesion) })

// Un rol con el nombre que se usa en las pantallas. permisos = los nombres de los permisos
// que tiene (el backend no manda el campo si no tiene ninguno)
export const aRol = (dato) => ({ id: dato.idRol, nombre: rolDelFront(dato.nombreRol), permisos: dato.permisos ?? [] })

export const aPermiso = (dato) => ({ id: dato.idPermiso, nombre: dato.nombrePermiso, descripcion: dato.descripcion ?? '' })
