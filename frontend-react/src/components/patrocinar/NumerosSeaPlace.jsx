import { useSelector } from 'react-redux'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Precio from '../comunes/Precio'
import TarjetaDato from '../comunes/TarjetaDato'

// SeaPlace en números, con los datos reales del catálogo y de los patrocinadores (los pide PaginaPatrocinar)
const NumerosSeaPlace = () => {
  const { items: animales, loading: cargandoAnimales, error: errorAnimales } = useSelector((state) => state.animales)
  const { items: patrocinadores, loading: cargandoPatrocinadores, error: errorPatrocinadores } = useSelector((state) => state.patrocinadores)

  if (cargandoAnimales || cargandoPatrocinadores) {
    return <Cargando texto="Contando nuestro impacto…" />
  }
  if (errorAnimales || errorPatrocinadores) {
    return <AvisoError mensaje={errorAnimales || errorPatrocinadores} />
  }

  const refugios = new Set(animales.map((animal) => animal.idRefugio)).size
  const cuposTomados = animales.reduce((suma, animal) => suma + animal.cuposTotales - animal.cuposDisponibles, 0)
  const duplicado = patrocinadores.reduce((suma, patrocinador) => suma + patrocinador.aportado, 0)

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
      <TarjetaDato icono="pets" valor={animales.length} titulo="Animales esperando padrinos" clase="bg-primary text-on-primary" />
      <TarjetaDato icono="favorite" valor={cuposTomados} titulo="Cupos ya apadrinados" clase="bg-secondary-container text-on-secondary-container" />
      <TarjetaDato icono="home_health" valor={refugios} titulo="Refugios aprobados" clase="bg-tertiary-fixed text-on-tertiary-fixed" />
      <TarjetaDato icono="volunteer_activism" valor={<Precio valor={duplicado} />} titulo={`Duplicados por ${patrocinadores.length} empresas`} clase="bg-surface-container-lowest text-primary" />
    </section>
  )
}

export default NumerosSeaPlace
