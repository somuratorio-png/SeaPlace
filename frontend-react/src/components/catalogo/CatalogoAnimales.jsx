import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BarraBusqueda from './BarraBusqueda'
import FiltroCategorias from './FiltroCategorias'
import ResultadosCatalogo from './ResultadosCatalogo'
import AvisoError from '../comunes/AvisoError'
import EstadoCarga from '../comunes/EstadoCarga'
import Paginacion from '../comunes/Paginacion'
import Portada from '../comunes/Portada'
import { traerAnimales, traerCategorias } from '../../services/animales'
import { aDolares } from '../../contexto/Moneda'
import { comparadores } from '../../utils/ordenAnimales'
import { textoDelAnimal } from '../../utils/texto'
import { validarRangoPrecio } from '../../utils/validaciones'
import { useFavoritos } from '../../hooks/useFavoritos'
import { useMoneda } from '../../hooks/useMoneda'
import { useConsulta } from '../../hooks/useConsulta'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'

const ANIMALES_POR_PAGINA = 6

// El catálogo. Pide al backend, cuando se monta, los animales publicados y las categorías (un pedido
// por lista). Los filtros y el orden se aplican acá, sobre la lista ya recibida.
const CatalogoAnimales = () => {
  const navigate = useNavigate()
  const { favoritos } = useFavoritos()
  const { moneda } = useMoneda()
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const errorPrecio = validarRangoPrecio(precioMin, precioMax)
  // El rango se escribe en la moneda elegida y los precios llegan en dólares. Si el rango está mal escrito, no se filtra por precio.
  const minimo = errorPrecio || precioMin === '' ? null : aDolares(Number(precioMin), moneda)
  const maximo = errorPrecio || precioMax === '' ? null : aDolares(Number(precioMax), moneda)
  const { datos: animales, cargando, error: errorAnimales } = useConsulta(traerAnimales, undefined, [])
  const { datos: categorias, error: errorCategorias } = useConsulta(traerCategorias, undefined, [])
  const error = errorAnimales ?? errorCategorias
  const [categoria, setCategoria] = useState('todas')
  const [urgencia, setUrgencia] = useState('todas')
  const [orden, setOrden] = useState('recomendados')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  // Nos quedamos con los animales que cumplen los filtros a la vez y los ordenamos.
  const filtrados = animales
    .filter((animal) => categoria === 'todas' || animal.categoria === categoria)
    .filter((animal) => urgencia === 'todas' || animal.urgencia === urgencia)
    .filter((animal) => (minimo === null || animal.precio >= minimo) && (maximo === null || animal.precio <= maximo))
    .filter((animal) => !soloFavoritos || favoritos.some((guardado) => guardado.id === animal.id))
  const ordenados = orden === 'recomendados' ? filtrados : [...filtrados].sort(comparadores[orden])

  const { busqueda, buscar, encontrados, items: visibles, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(ordenados, textoDelAnimal, ANIMALES_POR_PAGINA)

  const alFiltrar = (guardar) => (valor) => {
    guardar(valor)
    setPagina(0)
  }

  // Debajo de la portada: el aviso de espera, el error del backend o el catálogo con sus filtros
  const elegirContenido = () => {
    if (cargando || error) {
      return <EstadoCarga cargando={cargando} error={error} texto="Cargando el catálogo…" />
    }

    return (
      <>
        <FiltroCategorias categorias={categorias} animales={animales} categoriaActiva={categoria} onCambiar={alFiltrar(setCategoria)} />
        <BarraBusqueda
          busqueda={busqueda}
          onBusqueda={buscar}
          urgencia={urgencia}
          onUrgencia={alFiltrar(setUrgencia)}
          orden={orden}
          onOrden={alFiltrar(setOrden)}
          soloFavoritos={soloFavoritos}
          onSoloFavoritos={alFiltrar(setSoloFavoritos)}
          precioMin={precioMin}
          onPrecioMin={alFiltrar(setPrecioMin)}
          precioMax={precioMax}
          onPrecioMax={alFiltrar(setPrecioMax)}
          errorPrecio={errorPrecio}
          simboloMoneda={moneda === 'USD' ? 'US$' : '$'}
        />
        <ResultadosCatalogo
          animales={visibles}
          cantidadEncontrados={encontrados.length}
          hayPublicados={animales.length > 0}
          onError={setErrorAccion}
          onVer={(id) => navigate(`/animal/${id}`)}
        />
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

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
        {elegirContenido()}
      </div>
    </>
  )
}

export default CatalogoAnimales