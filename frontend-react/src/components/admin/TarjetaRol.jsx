import { useState } from 'react'

// Un rol con sus permisos: se tildan los que tiene que tener y se guardan todos juntos
// (la asignación reemplaza el conjunto completo). "permisos" son todos los que existen.
// onAsignar(idRol, idsPermisos) devuelve el mensaje de error del backend, o null si salió bien.
const TarjetaRol = ({ rol, permisos, onAsignar }) => {
  // Arranca con los que el rol ya tiene. rol.permisos trae los nombres, y acá se guardan los ids.
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

  const guardar = async () => {
    const mensaje = await onAsignar(rol.id, elegidos)
    setGuardado(mensaje === null)
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md space-y-space-sm">
      <h3 className="font-title-lg text-title-lg text-primary">{rol.nombre}</h3>

      {permisos.map((permiso) => (
        <label key={permiso.id} className="flex items-start gap-space-sm cursor-pointer">
          <input type="checkbox" checked={elegidos.includes(permiso.id)} onChange={() => alternar(permiso.id)} className="mt-1 accent-secondary w-4 h-4" />
          <span>
            <span className="block font-label-lg text-label-lg text-on-surface">{permiso.nombre}</span>
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
  )
}

export default TarjetaRol
