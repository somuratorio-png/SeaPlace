// Un animal del refugio, con el botón para quitarlo del catálogo
const FilaAnimal = ({ animal, onVer, onQuitar }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-wrap items-center gap-space-md">
      <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-20 h-20 object-cover rounded-lg" />

      <div className="flex-1 min-w-40">
        <h3 className="font-title-lg text-title-lg text-on-surface">{animal.nombre}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {animal.especie} · {animal.estado} · ${animal.precio}/mes
        </p>
        <p className="font-label-md text-label-md text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
      </div>

      <div className="flex items-center gap-space-md">
        <button onClick={() => onVer(animal)} className="font-label-lg text-label-lg text-primary hover:underline">
          Ver en el catálogo
        </button>
        <button onClick={() => onQuitar(animal.id)} className="font-label-lg text-label-lg text-error hover:underline">
          Quitar
        </button>
      </div>
    </div>
  )
}

export default FilaAnimal
