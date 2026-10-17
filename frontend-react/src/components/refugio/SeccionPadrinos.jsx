import TituloSeccion from '../comunes/TituloSeccion'
import ListaPadrinos from './ListaPadrinos'

// Sección "Padrinos" del panel del refugio
const SeccionPadrinos = ({ apadrinamientos }) => {
  return (
    <section className="space-y-space-md">
      <TituloSeccion>Padrinos</TituloSeccion>
      <ListaPadrinos apadrinamientos={apadrinamientos} />
    </section>
  )
}

export default SeccionPadrinos