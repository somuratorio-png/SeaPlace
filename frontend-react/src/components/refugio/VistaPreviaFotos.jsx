import Icono from '../comunes/Icono'

const VistaPreviaFotos = ({ fotos, onQuitar }) => {
  return (
    <div className="flex flex-wrap gap-space-sm">
      {fotos.map((foto, indice) => (
        <div key={foto.vistaPrevia} className="relative">
          <img src={foto.vistaPrevia} alt={`Foto elegida ${indice + 1}`} className="w-20 h-20 object-cover rounded-xl" />
          <button
            type="button"
            onClick={() => onQuitar(indice)}
            aria-label={`Quitar la foto ${indice + 1}`}
            title="Quitar foto"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:scale-110"
          >
            <Icono nombre="close" clase="text-[16px] text-on-surface-variant" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default VistaPreviaFotos
