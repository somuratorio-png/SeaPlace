const testimonios = [
  { nombre: 'Camila Lagos', rol: 'Madrina de Nori • Santiago, Chile', texto: 'Ver el mapa de telemetría de Nori cada semana con mis hijos fue la lección más hermosa de biología marina.' },
  { nombre: 'Mateo Restrepo', rol: 'Padrino de Kelp • Bogotá, Colombia', texto: 'El respeto con que tratan a las nutrias me conmovió. El certificado es una pequeña obra de arte.' },
  { nombre: 'Elena Solís', rol: 'Educadora Marina • Ensenada, México', texto: 'Apadriné en nombre de mi clase. Los reportes de la tortuga laúd inspiraron a mis alumnos a limpiar las playas.' },
]

const Testimonios = () => {
  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
        Testimonios de Quienes Custodian el Mar
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {testimonios.map((testimonio) => (
          <div key={testimonio.nombre} className="bg-surface-container-low rounded-xl p-space-lg space-y-space-sm">
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
