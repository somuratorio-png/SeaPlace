import { useEffect, useState } from 'react'
import AvisoError from '../components/comunes/AvisoError'
import Cargando from '../components/comunes/Cargando'
import AnimalesDestacados from '../components/inicio/AnimalesDestacados'
import Estadisticas from '../components/inicio/Estadisticas'
import Hero from '../components/inicio/Hero'
import KitProtector from '../components/inicio/KitProtector'
import Testimonios from '../components/inicio/Testimonios'
import { traerAnimales } from '../services/animales'

// Página de inicio. Pide el catálogo al backend cuando se monta y de ahí muestra los destacados.
const Inicio = ({ onVerCatalogo, onVerAnimal }) => {
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

export default Inicio
