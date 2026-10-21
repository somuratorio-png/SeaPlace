import FilaDato from './FilaDato'

const FichaAnimal = ({ animal }) => {

  const datos = [
    { etiqueta: 'Especie', valor: animal.especie },
    { etiqueta: 'Edad', valor: animal.edad },
    { etiqueta: 'Ubicación', valor: animal.ubicacion },
    { etiqueta: 'Estado', valor: animal.estado },
    { etiqueta: 'Cupos disponibles', valor: `${animal.cuposDisponibles} de ${animal.cuposTotales}` },
  ]

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Ficha</h2>
        {datos.map((dato) => (
          <FilaDato key={dato.etiqueta} etiqueta={dato.etiqueta} valor={dato.valor} />
        ))}
    </div>
  )
}

export default FichaAnimal
