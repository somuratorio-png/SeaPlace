import Icono from '../comunes/Icono'

// Un botón de categoría ("pill"). La activa se ve en color primario.
const BotonCategoria = ({ nombre, icono, cantidad, activa, onClick }) => {
  const estilo = activa ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
  return (
    <button onClick={onClick} className={`px-space-md py-2 rounded-lg font-label-lg text-label-lg flex items-center gap-2 whitespace-nowrap ${estilo}`}>
      <Icono nombre={icono} clase="text-lg" />
      {nombre} ({cantidad})
    </button>
  )
}

export default BotonCategoria
