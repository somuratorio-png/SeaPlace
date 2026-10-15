import { useEffect, useState } from 'react'
import BarraBusqueda from './BarraBusqueda'
import FiltroCategorias from './FiltroCategorias'
import TarjetaAnimal from './TarjetaAnimal'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Paginacion from '../comunes/Paginacion'
import Portada from '../comunes/Portada'
import { traerAnimales, traerCategorias } from '../../services/animales'
import { paginar } from '../../utils/paginar'
import { precioFinal } from '../../utils/precios'
import { useNavigate } from 'react-router-dom'

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

// El catálogo. Pide al backend, cuando se monta, los animales publicados y las categorías (un pedido
// por lista). Los filtros y el orden se aplican acá, sobre la lista ya recibida.
//"favoritos" son los animales que guardó el usuario, que tiene Sitio.
const CatalogoAnimales = ({usuario, favoritos, onCambiarFavoritos, onError }) => {
  const navigate = useNavigate()
  const [animales, setAnimales] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [categoria, setCategoria] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [urgencia, setUrgencia] = useState('todas')
  const [orden, setOrden] = useState('recomendados')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [pagina, setPagina] = useState(0)

  // Un solo pedido de los animales, al abrir la página
  useEffect(() => {
    traerAnimales()
      .then((lista) => {
        setAnimales(lista)
      })
      .catch((falla) => {
        setError(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  // Y uno de las categorías, para los filtros
  useEffect(() => {
    traerCategorias()
      .then((lista) => {
        setCategorias(lista)
      })
      .catch((falla) => {
        setError(falla.message)
      })
  }, [])

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
        .filter((animal) => !soloFavoritos || favoritos.some((guardado) => guardado.id === animal.id))
    .filter((animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`.toLowerCase().includes(texto))

  // "Recomendados" deja el orden original. Para el resto se ordena una copia (sort modifica el array)
  const ordenados = orden === 'recomendados' ? filtrados : [...filtrados].sort(comparadores[orden])

  // Se muestran de a 6
  const { items: visibles, paginaActual, totalPaginas } = paginar(ordenados, pagina, ANIMALES_POR_PAGINA)

  // Debajo de la portada: el aviso de espera, el error del backend o el catálogo con sus filtros
  const elegirContenido = () => {
    if (cargando) {
      return <Cargando texto="Buscando a los animales…" />
    }
    if (error) {
      return <AvisoError mensaje={error} />
    }
    return (
      <>
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
            {animales.length === 0 ? 'Todavía no hay animales publicados para apadrinar.' : 'Ningún animal coincide con esos filtros. Probá con otra búsqueda.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {visibles.map((animal) => (
              <TarjetaAnimal
                key={animal.id}
                animal={animal}
                usuario={usuario}
                favoritos={favoritos}
                onCambiarFavoritos={onCambiarFavoritos}
                onError={onError}
                onVer={() => navigate(`/animal/${animal.id}`)}
              />
            ))}
          </div>
        )}

        <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
      </>
    )
  }

  return (
    <>
      <Portada
        icono="pets"
        etiqueta="Fauna para apadrinar"
        titulo="Encontrá a tu compañero del océano"
        texto="Crías huérfanas, ejemplares vulnerables y mamíferos en recuperación. Tu aporte mensual cubre su nutrición y sus cuidados hasta que vuelvan al mar."
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">{elegirContenido()}</div>
    </>
  )
}

export default CatalogoAnimales
