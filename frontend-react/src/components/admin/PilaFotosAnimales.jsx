const PilaFotosAnimales = ({ animales }) => {
  return (
    <div className="flex -space-x-3">
      {animales.map((animal) => (
        <img
          key={animal.id}
          src={animal.imagen}
          alt={`Foto de ${animal.nombre}`}
          title={animal.nombre}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-lowest"
        />
      ))}
    </div>
  )
}

export default PilaFotosAnimales