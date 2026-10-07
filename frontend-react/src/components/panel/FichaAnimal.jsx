// Datos básicos del animal apadrinado, en formato "etiqueta: valor"
const FichaAnimal = ({ animal }) => {
  const datos = [
    { etiqueta: 'Especie', valor: animal.especie },
    { etiqueta: 'Edad', valor: animal.edad },
    { etiqueta: 'Ubicación', valor: animal.ubicacion },
    { etiqueta: 'Estado', valor: animal.estado },
  ]

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-sm">
      <h2 className="font-title-lg text-title-lg text-on-surface">Ficha</h2>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="flex justify-between gap-space-md">
          <span className="font-body-sm text-body-sm text-on-surface-variant">{dato.etiqueta}</span>
          <span className="font-label-lg text-label-lg text-on-surface text-right">{dato.valor}</span>
        </div>
      ))}
    </div>
  )
}

export default FichaAnimal
