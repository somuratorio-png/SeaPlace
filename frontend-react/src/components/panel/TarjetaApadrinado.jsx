import Precio from '../comunes/Precio'
import BarraProgreso from '../comunes/BarraProgreso'

// Un animal que el usuario ya apadrinó, con su progreso de rehabilitación
const TarjetaApadrinado = ({ item, onVer }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-full h-48 object-cover" />
      <div className="p-space-md space-y-space-sm">
        <h3 className="font-headline-sm text-headline-sm text-primary">{item.animal.nombre}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {item.animal.estado} · {item.animal.ubicacion}
        </p>
        <p className="font-label-md text-label-md text-secondary">
          Plan {item.plan.nombre} · <Precio valor={item.plan.precio} />/mes
        </p>
        <BarraProgreso porcentaje={item.animal.progreso} />
        <button onClick={() => onVer(item)} className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-space-sm rounded-full hover:bg-surface-tint">
          Ver detalles
        </button>
      </div>
    </div>
  )
}

export default TarjetaApadrinado
