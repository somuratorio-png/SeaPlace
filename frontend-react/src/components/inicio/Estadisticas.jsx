import Icono from '../comunes/Icono'

const estadisticas = [
  { icono: 'biotech', valor: '28', titulo: 'Especies Monitoreadas', clase: 'bg-primary-fixed text-on-primary-fixed-variant' },
  { icono: 'home_health', valor: '12', titulo: 'Centros de Rescate', clase: 'bg-secondary-container text-on-secondary-fixed-variant' },
  { icono: 'water_drop', valor: '1.8M', titulo: 'Litros de Refugio', clase: 'bg-primary-fixed text-on-primary-fixed-variant' },
  { icono: 'volunteer_activism', valor: '94%', titulo: 'Tasa de Rehabilitación', clase: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
]

const Estadisticas = () => {
  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-2 lg:grid-cols-4 gap-space-md">
      {estadisticas.map((dato) => (
        <div key={dato.titulo} className={`revelar rounded-2xl p-space-lg shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${dato.clase}`}>
          <Icono nombre={dato.icono} clase="text-[32px]" />
          <div className="font-headline-lg text-headline-lg">{dato.valor}</div>
          <div className="font-title-lg text-title-lg">{dato.titulo}</div>
        </div>
      ))}
    </section>
  )
}

export default Estadisticas
