import BarraBusqueda from './BarraBusqueda'
import FiltroCategorias from './FiltroCategorias'
import TarjetaAnimal from './TarjetaAnimal'
import AvisoError from '../comunes/AvisoError'
import EstadoCarga from '../comunes/EstadoCarga'
import Paginacion from '../comunes/Paginacion'
import Portada from '../comunes/Portada'
import { traerAnimales, traerCategorias } from '../../services/animales'
import { precioFinal } from '../../utils/precios'
import { useNavigate } from 'react-router-dom'
import { useFavoritos } from '../../hooks/useFavoritos'
import { useConsulta } from '../../hooks/useConsulta'
import { useState } from 'react'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import MensajeVacio from '../comunes/MensajeVacio'

const ANIMALES_POR_PAGINA = 6
const textoDelAnimal = (animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`

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
const CatalogoAnimales = () => {
  const navigate = useNavigate()
  const { favoritos } = useFavoritos()
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
        />

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {visibles.length} de {encontrados.length} animales
        </p>

        {visibles.length === 0 ? (
          <MensajeVacio clase="py-space-xl">
            {animales.length === 0 ? 'Todavía no hay animales publicados para apadrinar.' : 'Ningún animal coincide con esos filtros. Probá con otra búsqueda.'}
          </MensajeVacio>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {visibles.map((animal) => (
              <TarjetaAnimal
                key={animal.id}
                animal={animal}
                onError={setErrorAccion}
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

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}
        {elegirContenido()}
      </div>
    </>
  )
}

export default CatalogoAnimales
