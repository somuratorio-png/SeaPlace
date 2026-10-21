import TituloSeccion from '../comunes/TituloSeccion'
import ListaPadrinos from './ListaPadrinos'

const SeccionPadrinos = ({ apadrinamientos }) => {
  return (
    <section className="space-y-space-md">
      <TituloSeccion>Padrinos</TituloSeccion>
      <ListaPadrinos apadrinamientos={apadrinamientos} />
    </section>
  )
}

export default SeccionPadrinos