import Icono from '../comunes/Icono'

// Un animal recién apadrinado con el botón para ver su certificado. "item" es el apadrinamiento.
const FilaCertificado = ({ item, onVer }) => {
  return (
    <div className="flex flex-wrap items-center gap-space-md">
      <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-16 h-16 object-cover rounded-full" />
      <div className="flex-1 min-w-40">
        <p className="font-title-lg text-title-lg text-on-surface">{item.animal.nombre}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Plan {item.plan.nombre}</p>
      </div>
      <button
        onClick={() => onVer(item)}
        className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container"
      >
        <Icono nombre="workspace_premium" clase="text-[20px]" /> Ver certificado
      </button>
    </div>
  )
}

export default FilaCertificado