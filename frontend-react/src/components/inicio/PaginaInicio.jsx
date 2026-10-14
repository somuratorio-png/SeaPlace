import { useEffect, useState } from 'react'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import AnimalesDestacados from './AnimalesDestacados'
import Estadisticas from './Estadisticas'
import Hero from './Hero'
import KitProtector from './KitProtector'
import Testimonios from './Testimonios'
import { traerAnimales } from '../../services/animales'

// Página de inicio. Pide el catálogo al backend cuando se monta y de ahí muestra los destacados.
const PaginaInicio = (onVerCatalogo, onVerAnimal) => {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Un solo pedido, al abrir la página
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
    return <AnimalesDestacados animales={destacados} onVerAnimal={onVerAnimal} />
  }

  return (
    <>
      <Hero onVerCatalogo={onVerCatalogo} />
      <Estadisticas />
      {elegirDestacados()}
      <KitProtector />
      <Testimonios />
    </>
  )
}

export default PaginaInicio
