import { useState } from 'react'
import BarraBusqueda from '../components/catalogo/BarraBusqueda'
import FiltroCategorias from '../components/catalogo/FiltroCategorias'
import TarjetaAnimal from '../components/catalogo/TarjetaAnimal'
import Paginacion from '../components/comunes/Paginacion'
import Portada from '../components/comunes/Portada'
import { categorias } from '../data/animales'
import { paginar } from '../utils/paginar'
import { precioFinal } from '../utils/precios'

const ANIMALES_POR_PAGINA = 6

// Cuanto más chico el número, más urgente
const pesoUrgencia = { critico: 0, recuperacion: 1, listo: 2 }

// Cada forma de ordenar es una función que compara dos animales (como pide .sort)
const comparadores = {
  urgencia: (a, b) => pesoUrgencia[a.urgencia] - pesoUrgencia[b.urgencia],
  progreso: (a, b) => a.progreso - b.progreso,
  'precio-menor': (a, b) => precioFinal(a) - precioFinal(b),
  'precio-mayor': (a, b) => precioFinal(b) - precioFinal(a),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre),
}

const Catalogo = ({ animales, favoritos, onFavorito, onVerAnimal }) => {
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [urgencia, setUrgencia] = useState('todas')
  const [orden, setOrden] = useState('recomendados')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [pagina, setPagina] = useState(0)

  // Cada vez que cambia un filtro, se guarda el valor nuevo y se vuelve a la primera página
  const alFiltrar = (guardar) => (valor) => {
    guardar(valor)
    setPagina(0)
  }

  // Nos quedamos con los animales que cumplen todos los filtros a la vez
  const texto = busqueda.toLowerCase()
  const filtrados = animales
    .filter((animal) => categoria === 'todas' || animal.categoria === categoria)
    .filter((animal) => urgencia === 'todas' || animal.urgencia === urgencia)
    .filter((animal) => !soloFavoritos || favoritos.includes(animal.id))
    .filter((animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`.toLowerCase().includes(texto))

  // "Recomendados" deja el orden original. Para el resto se ordena una copia (sort modifica el array)
  const ordenados = orden === 'recomendados' ? filtrados : [...filtrados].sort(comparadores[orden])

  // Se muestran de a 6: es lo mismo que le va a pedir el front al backend (?page=0&size=6)
  const { items: visibles, paginaActual, totalPaginas } = paginar(ordenados, pagina, ANIMALES_POR_PAGINA)

  return (
    <>
      <Portada
        icono="pets"
        etiqueta="Fauna para apadrinar"
        titulo="Encontrá a tu compañero del océano"
        texto="Crías huérfanas, ejemplares vulnerables y mamíferos en recuperación. Tu aporte mensual cubre su nutrición y sus cuidados hasta que vuelvan al mar."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        <FiltroCategorias categorias={categorias} animales={animales} categoriaActiva={categoria} onCambiar={alFiltrar(setCategoria)} />
        <BarraBusqueda
          busqueda={busqueda}
          onBusqueda={alFiltrar(setBusqueda)}
          urgencia={urgencia}
          onUrgencia={alFiltrar(setUrgencia)}
          orden={orden}
          onOrden={alFiltrar(setOrden)}
          soloFavoritos={soloFavoritos}
          onSoloFavoritos={alFiltrar(setSoloFavoritos)}
        />

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {visibles.length} de {ordenados.length} animales
        </p>

        {visibles.length === 0 ? (
          <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-xl">
            Ningún animal coincide con esos filtros. Probá con otra búsqueda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {visibles.map((animal) => (
              <TarjetaAnimal
                key={animal.id}
                animal={animal}
                esFavorito={favoritos.includes(animal.id)}
                onFavorito={() => onFavorito(animal.id)}
                onVer={() => onVerAnimal(animal)}
              />
            ))}
          </div>
        )}

        <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
      </div>
    </>
  )
}

export default Catalogo
