import { useState } from 'react'
import BarraBusqueda from '../components/catalogo/BarraBusqueda'
import FiltroCategorias from '../components/catalogo/FiltroCategorias'
import TarjetaAnimal from '../components/catalogo/TarjetaAnimal'
import { animales, categorias } from '../data/animales'

const Catalogo = ({ onVerAnimal }) => {
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [urgencia, setUrgencia] = useState('todas')

  // Nos quedamos con los animales que cumplen los 3 filtros a la vez
  const texto = busqueda.toLowerCase()
  const visibles = animales
    .filter((animal) => categoria === 'todas' || animal.categoria === categoria)
    .filter((animal) => urgencia === 'todas' || animal.urgencia === urgencia)
    .filter((animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`.toLowerCase().includes(texto))

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <div className="max-w-2xl space-y-space-xs">
        <h1 className="font-headline-lg text-headline-lg text-primary">Encontrá a tu compañero del océano</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Crías huérfanas, ejemplares vulnerables y mamíferos en recuperación. Tu aporte mensual cubre su nutrición y sus
          cuidados hasta que vuelvan al mar.
        </p>
      </div>

      <FiltroCategorias categorias={categorias} animales={animales} categoriaActiva={categoria} onCambiar={setCategoria} />
      <BarraBusqueda busqueda={busqueda} onBusqueda={setBusqueda} urgencia={urgencia} onUrgencia={setUrgencia} />

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Mostrando {visibles.length} de {animales.length} animales
      </p>

      {visibles.length === 0 ? (
        <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-xl">
          Ningún animal coincide con esos filtros. Probá con otra búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibles.map((animal) => (
            <TarjetaAnimal key={animal.id} animal={animal} onVer={() => onVerAnimal(animal)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Catalogo
