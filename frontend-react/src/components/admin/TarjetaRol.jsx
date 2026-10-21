import { useState } from 'react'

const TarjetaRol = ({ rol, permisos, onAsignar }) => {
  const [elegidos, setElegidos] = useState(() => permisos.filter((permiso) => rol.permisos.includes(permiso.nombre)).map((permiso) => permiso.id))
  const [guardado, setGuardado] = useState(false)

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
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md space-y-space-sm">
      <h3 className="font-title-lg text-title-lg text-primary">{rol.nombre}</h3>

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
            <span className="block font-label-lg text-label-lg text-on-surface">{permiso.nombre}</span>
            <span className="block font-body-sm text-body-sm text-on-surface-variant">{permiso.descripcion}</span>
          </span>
        </label>
      ))}

      <div className="flex flex-wrap items-center gap-space-md">
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
  )
}

export default TarjetaRol
