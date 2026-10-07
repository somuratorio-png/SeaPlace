import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'

const claseBoton = 'w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center disabled:opacity-40'

// Un animal dentro del muelle: el plan elegido, los botones de más y menos para elegir cuántos
// cupos de ese animal se toman (hasta los que le quedan disponibles), y el botón para sacarlo
const MuelleDetalle = ({ item, onCantidad, onQuitar }) => {
  return (
    <li className="flex flex-wrap gap-space-md items-center py-space-md">
      <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-20 h-20 object-cover rounded-lg" />
      <div className="flex-1 min-w-40">
        <h3 className="font-title-lg text-title-lg text-on-surface">
          {item.animal.nombre} · {item.animal.especie}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Plan {item.plan.nombre} · <Precio valor={item.plan.precio} />
          /mes por cupo
        </p>
        <p className="font-label-md text-label-md text-secondary">
          Quedan {item.animal.cuposDisponibles} {item.animal.cuposDisponibles === 1 ? 'cupo disponible' : 'cupos disponibles'}
        </p>
      </div>

      <div className="flex items-center gap-space-md">
        <button onClick={() => onCantidad(item.cantidad - 1)} disabled={item.cantidad === 1} aria-label="Un cupo menos" className={claseBoton}>
          <Icono nombre="remove" clase="text-[20px]" />
        </button>
        <span className="w-20 text-center font-title-lg text-title-lg text-on-surface tabular-nums">
          {item.cantidad} {item.cantidad === 1 ? 'cupo' : 'cupos'}
        </span>
        <button onClick={() => onCantidad(item.cantidad + 1)} disabled={item.cantidad >= item.animal.cuposDisponibles} aria-label="Un cupo más" className={claseBoton}>
          <Icono nombre="add" clase="text-[20px]" />
        </button>
      </div>

      <div className="text-right space-y-space-xs">
        <p className="font-headline-sm text-headline-sm text-primary tabular-nums">
          <Precio valor={item.plan.precio * item.cantidad} />
          /mes
        </p>
        <button onClick={onQuitar} className="font-label-md text-label-md text-error inline-flex items-center gap-1">
          <Icono nombre="delete" clase="text-base" /> Quitar
        </button>
      </div>
    </li>
  )
}

export default MuelleDetalle
