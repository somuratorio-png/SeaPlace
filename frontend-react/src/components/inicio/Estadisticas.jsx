import Icono from '../comunes/Icono'

const estadisticas = [
  { icono: 'biotech', valor: '28', titulo: 'Especies Monitoreadas' },
  { icono: 'home_health', valor: '12', titulo: 'Centros de Rescate' },
  { icono: 'water_drop', valor: '1.8M', titulo: 'Litros de Refugio' },
  { icono: 'volunteer_activism', valor: '94%', titulo: 'Tasa de Rehabilitación' },
]

const Estadisticas = () => {
  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-2 lg:grid-cols-4 gap-space-md">
      {estadisticas.map((dato) => (
        <div key={dato.titulo} className="bg-surface-container rounded-xl p-space-lg">
          <Icono nombre={dato.icono} clase="text-secondary text-[28px]" />
          <div className="font-headline-lg text-headline-lg text-primary">{dato.valor}</div>
          <div className="font-title-lg text-title-lg text-on-surface">{dato.titulo}</div>
        </div>
      ))}
    </section>
  )
}

export default Estadisticas
