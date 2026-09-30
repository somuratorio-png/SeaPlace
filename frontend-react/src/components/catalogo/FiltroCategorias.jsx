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

const FiltroCategorias = ({ categorias, animales, categoriaActiva, onCambiar }) => {
  return (
    <div className="flex flex-wrap gap-space-xs">
      <BotonCategoria
        nombre="Todas las especies"
        icono="grid_view"
        cantidad={animales.length}
        activa={categoriaActiva === 'todas'}
        onClick={() => onCambiar('todas')}
      />
      {categorias.map((categoria) => (
        <BotonCategoria
          key={categoria.id}
          nombre={categoria.nombre}
          icono={categoria.icono}
          cantidad={animales.filter((animal) => animal.categoria === categoria.id).length}
          activa={categoriaActiva === categoria.id}
          onClick={() => onCambiar(categoria.id)}
        />
      ))}
    </div>
  )
}

export default FiltroCategorias
