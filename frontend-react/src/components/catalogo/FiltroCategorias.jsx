import BotonCategoria from './BotonCategoria'

const FiltroCategorias =({ categorias, animales, categoriaActiva, onCambiar }) => {
  return (
    <div className="flex flex-wrap gap-space-sm">
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
