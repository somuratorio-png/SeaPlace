import FilaAnimal from '../comunes/FilaAnimal'

// La lista desplegable con los animales de un refugio, o un aviso si todavía no publicó ninguno
const AnimalesDelRefugio = ({ animales, onQuitar }) => {
  return (
    <div className="bg-surface-container-low rounded-b-2xl p-space-md space-y-space-sm">
      {animales.length === 0 && <p className="font-body-sm text-body-sm text-on-surface-variant">Este refugio todavía no publicó animales.</p>}
      {animales.map((animal) => (
        <FilaAnimal key={animal.id} animal={animal} onQuitar={onQuitar} />
      ))}
    </div>
  )
}

export default AnimalesDelRefugio