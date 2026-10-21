import { useState } from 'react'
import Icono from '../comunes/Icono'
import { sinGuiones } from '../../utils/roles'

// Un rol con sus permisos, en un desplegable: arranca cerrado y al abrirlo se tildan los que tiene
// que tener y se guardan todos juntos (la asignación reemplaza el conjunto completo).
// "permisos" son todos los que existen.
// onAsignar(idRol, idsPermisos) devuelve el mensaje de error del backend, o null si salió bien.
const TarjetaRol = ({ rol, permisos, onAsignar }) => {
  // Arranca con los que el rol ya tiene. rol.permisos trae los nombres, y acá se guardan los ids.
  const [elegidos, setElegidos] = useState(() => permisos.filter((permiso) => rol.permisos.includes(permiso.nombre)).map((permiso) => permiso.id))
  const [guardado, setGuardado] = useState(false)
  const [abierto, setAbierto] = useState(false)

  const alternar = (idPermiso) => {
    setGuardado(false)
    if (elegidos.includes(idPermiso)) {
      setElegidos(elegidos.filter((id) => id !== idPermiso))
    } else {
      setElegidos([...elegidos, idPermiso])
    }
  }

  const guardar = () => {
    onAsignar(rol.id, elegidos).then((mensaje) => {
      setGuardado(mensaje === null)
    })
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className="w-full flex items-center justify-between gap-space-sm p-space-md text-left"
      >
        <span>
          <span className="block font-title-lg text-title-lg text-primary">{sinGuiones(rol.nombre)}</span>
          <span className="block font-body-sm text-body-sm text-on-surface-variant">
            {elegidos.length} {elegidos.length === 1 ? 'permiso' : 'permisos'}
          </span>
        </span>
        <Icono nombre={abierto ? 'expand_less' : 'expand_more'} clase="text-[24px] text-on-surface-variant" />
      </button>

      {abierto && (
        <div className="px-space-md pb-space-md space-y-space-sm">
          {permisos.length === 0 && <p className="font-body-sm text-body-sm text-on-surface-variant">Todavía no hay permisos para asignar.</p>}
          {permisos.map((permiso) => (
            <label key={permiso.id} htmlFor={`permiso-${rol.id}-${permiso.id}`} className="flex items-start gap-space-sm cursor-pointer">
              <input
                type="checkbox"
                id={`permiso-${rol.id}-${permiso.id}`}
                name={`permiso-${permiso.id}`}
                checked={elegidos.includes(permiso.id)}
                onChange={() => alternar(permiso.id)}
                className="mt-1 accent-secondary w-4 h-4"
              />
              <span>
                <span className="block font-label-lg text-label-lg text-on-surface">{sinGuiones(permiso.nombre)}</span>
                <span className="block font-body-sm text-body-sm text-on-surface-variant">{permiso.descripcion}</span>
              </span>
            </label>
          ))}

          <div className="flex flex-wrap items-center gap-space-md">
            {/* El backend no acepta dejar a un rol sin ningún permiso por esta vía */}
            <button
              onClick={guardar}
              disabled={elegidos.length === 0}
              className="bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full disabled:opacity-50"
            >
              Guardar permisos
            </button>
            {guardado && <span className="font-label-md text-label-md text-secondary">¡Guardado!</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default TarjetaRol
