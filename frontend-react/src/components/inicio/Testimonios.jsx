import TarjetaTestimonio from './TarjetaTestimonio'
import TituloSeccion from '../comunes/TituloSeccion'

const testimonios = [
  { nombre: 'Camila Lagos', rol: 'Madrina de Nori • Santiago, Chile', texto: 'Ver el mapa de telemetría de Nori cada semana con mis hijos fue la lección más hermosa de biología marina.' },
  { nombre: 'Mateo Restrepo', rol: 'Padrino de Kelp • Bogotá, Colombia', texto: 'El respeto con que tratan a las nutrias me conmovió. El certificado es una pequeña obra de arte.' },
  { nombre: 'Elena Solís', rol: 'Educadora Marina • Ensenada, México', texto: 'Apadriné en nombre de mi clase. Los reportes de la tortuga laúd inspiraron a mis alumnos a limpiar las playas.' },
]

const Testimonios = () => {
  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <TituloSeccion>Testimonios de Quienes Custodian el Mar</TituloSeccion>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {testimonios.map((testimonio) => (
          <TarjetaTestimonio key={testimonio.nombre} nombre={testimonio.nombre} rol={testimonio.rol} texto={testimonio.texto} />
        ))}
      </div>
    </section>
  )
}

export default Testimonios
