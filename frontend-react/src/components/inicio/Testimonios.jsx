import Icono from '../comunes/Icono'
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
          <div key={testimonio.nombre} className="revelar bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm border-t-4 transition hover:-translate-y-1 hover:shadow-lg border-tertiary-fixed-dim">
            <Icono nombre="format_quote" clase="text-tertiary text-[32px]" />
            <p className="font-body-md text-body-md text-on-surface italic">"{testimonio.texto}"</p>
            <div>
              <span className="font-title-lg text-title-lg text-primary block">{testimonio.nombre}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{testimonio.rol}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonios
