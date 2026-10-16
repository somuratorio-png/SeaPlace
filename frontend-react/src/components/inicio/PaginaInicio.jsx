import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import AnimalesDestacados from './AnimalesDestacados'
import Estadisticas from './Estadisticas'
import Hero from './Hero'
import KitProtector from './KitProtector'
import Testimonios from './Testimonios'
import { traerAnimales } from '../../services/animales'
import { useNavigate } from 'react-router-dom'
import { useConsulta } from '../../hooks/useConsulta'

// Página de inicio. Pide el catálogo al backend cuando se monta y de ahí muestra los destacados.
const PaginaInicio = () => {
  const navigate = useNavigate()
  const { datos: animales, cargando, error } = useConsulta(traerAnimales, undefined, [])

  const verCatalogo = () => {
    navigate('/catalogo')
  }

  const verAnimal = (animal) => {
    navigate(`/animal/${animal.id}`)
  }

  const destacados = animales.filter((animal) => animal.destacado)

  // La sección de destacados: el aviso de espera, el error del backend o las tarjetas
  const elegirDestacados = () => {
    if (cargando) {
      return <Cargando texto="Buscando a los animales destacados…" />
    }
    if (error) {
      return (
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
          <AvisoError mensaje={error} />
        </div>
      )
    }
    return <AnimalesDestacados animales={destacados} onVerAnimal={verAnimal} />
  }

  return (
    <>
      <Hero onVerCatalogo={verCatalogo} />
      <Estadisticas />
      {elegirDestacados()}
      <KitProtector />
      <Testimonios />
    </>
  )
}

export default PaginaInicio
