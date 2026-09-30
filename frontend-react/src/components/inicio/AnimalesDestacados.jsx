import TarjetaDestacada from './TarjetaDestacada'

const AnimalesDestacados = ({ animales, onVerAnimal }) => {
  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <div className="max-w-xl space-y-space-xs">
        <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
          Héroes del Agua Salada para Apadrinar
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cada habitante tiene un expediente clínico, una personalidad única y un viaje hacia la libertad que podés hacer
          posible con tu aporte mensual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {animales.map((animal) => (
          <TarjetaDestacada key={animal.id} animal={animal} onVer={() => onVerAnimal(animal)} />
        ))}
      </div>
    </section>
  )
}

export default AnimalesDestacados
