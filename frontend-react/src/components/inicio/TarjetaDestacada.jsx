import Precio from '../comunes/Precio'
import BarraProgreso from '../comunes/BarraProgreso'

// Tarjeta de un animal destacado en el inicio
const TarjetaDestacada = ({ animal, onVer }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col transition hover:-translate-y-1 hover:shadow-xl">
      <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-full aspect-square object-cover" />
      <div className="p-space-md space-y-space-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-primary">{animal.nombre}</h3>
          <span className="font-label-md text-label-md text-on-surface-variant">{animal.especie}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">{animal.descripcion}</p>
        <div className="flex justify-between font-label-md text-label-md">
          <span className="text-on-surface-variant">Meta mensual</span>
          <span className="text-secondary">{animal.progreso}%</span>
        </div>
        <BarraProgreso porcentaje={animal.progreso} />
        <button onClick={onVer} className="bg-primary text-on-primary font-label-lg text-label-lg py-2 rounded-full hover:bg-surface-tint">
          Conocer a {animal.nombre} · <Precio valor={animal.precio} />/mes
        </button>
      </div>
    </div>
  )
}

export default TarjetaDestacada
