import TarjetaEstadistica from './TarjetaEstadistica'

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
        <TarjetaEstadistica key={dato.titulo} icono={dato.icono} valor={dato.valor} titulo={dato.titulo} clase={dato.clase} />
      ))}
    </section>
  )
}

export default Estadisticas
