import Icono from '../comunes/Icono'

// Un animal dentro del carrito, con el plan elegido y el botón para sacarlo
const ItemCarrito = ({ item, onQuitar }) => {
  return (
    <li className="flex gap-space-md items-center py-space-md">
      <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-20 h-20 object-cover rounded-lg" />
      <div className="flex-1">
        <h3 className="font-title-lg text-title-lg text-on-surface">
          {item.animal.nombre} · {item.animal.especie}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Plan {item.plan.nombre}</p>
      </div>
      <div className="text-right">
        <p className="font-headline-sm text-headline-sm text-primary">${item.plan.precio}/mes</p>
        <button onClick={onQuitar} className="font-label-md text-label-md text-error inline-flex items-center gap-0.5">
          <Icono nombre="delete" clase="text-base" /> Quitar
        </button>
      </div>
    </li>
  )
}

export default ItemCarrito
