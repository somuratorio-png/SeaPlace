import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaMiAnimal from './TarjetaMiAnimal'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import MensajeVacio from '../comunes/MensajeVacio'

const ANIMALES_POR_PAGINA = 4
const textoDelAnimal = (animal) => `${animal.nombre} ${animal.especie} ${animal.estado}`

const ordenar = (animales) =>
  [...animales].sort((a, b) => {
    const pendienteA = a.publicacion === 'PENDIENTE'
    const pendienteB = b.publicacion === 'PENDIENTE'
    if (pendienteA !== pendienteB) {
      return pendienteA ? -1 : 1
    }
    return b.id - a.id
  })

const SeccionAnimales = ({ animales, apadrinamientos, categorias, onQuitar, onEditar, onGuardarDatos, onPublicarNovedad, onRegistrarUbicacion }) => {
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(ordenar(animales), textoDelAnimal, ANIMALES_POR_PAGINA)

  return (
    <section className="space-y-space-md">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <TituloSeccion>Mis animales</TituloSeccion>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {items.length} de {encontrados.length}
        </p>
      </div>
      <Buscador valor={busqueda} onCambiar={buscar} textoAyuda="Buscar por nombre, especie o estado..." />

      {animales.length === 0 && (
        <MensajeVacio clase="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl">Todavía no publicaste ningún animal.</MensajeVacio>
      )}
      {animales.length > 0 && encontrados.length === 0 && (
        <MensajeVacio clase="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg">Ningún animal coincide con esa búsqueda.</MensajeVacio>
      )}
      {items.map((animal) => (
        <TarjetaMiAnimal
          key={animal.id}
          animal={animal}
          apadrinamientos={apadrinamientos.filter((a) => a.animal.id === animal.id)}
          categorias={categorias}
          onQuitar={onQuitar}
          onEditar={onEditar}
          onGuardarDatos={onGuardarDatos}
          onPublicarNovedad={onPublicarNovedad}
          onRegistrarUbicacion={onRegistrarUbicacion}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionAnimales
