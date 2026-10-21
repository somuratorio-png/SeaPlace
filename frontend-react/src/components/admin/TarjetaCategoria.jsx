import Icono from '../comunes/Icono'

const TarjetaCategoria = ({ categoria, cantidad }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-center gap-space-md">
      <div className="w-12 h-12 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
        <Icono nombre={categoria.icono} />
      </div>
      <div>
        <h3 className="font-title-lg text-title-lg text-on-surface">{categoria.nombre}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {cantidad} {cantidad === 1 ? 'animal' : 'animales'}
        </p>
      </div>
    </div>
  )
}

export default TarjetaCategoria