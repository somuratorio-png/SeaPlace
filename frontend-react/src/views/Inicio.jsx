import AnimalesDestacados from '../components/inicio/AnimalesDestacados'
import Estadisticas from '../components/inicio/Estadisticas'
import Hero from '../components/inicio/Hero'
import KitProtector from '../components/inicio/KitProtector'
import Testimonios from '../components/inicio/Testimonios'

const Inicio = ({ animales, onVerCatalogo, onVerAnimal }) => {
  const destacados = animales.filter((animal) => animal.destacado)

  return (
    <>
      <Hero onVerCatalogo={onVerCatalogo} />
      <Estadisticas />
      <AnimalesDestacados animales={destacados} onVerAnimal={onVerAnimal} />
      <KitProtector />
      <Testimonios />
    </>
  )
}

export default Inicio
