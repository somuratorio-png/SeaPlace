import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaMiAnimal from './TarjetaMiAnimal'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'

const ANIMALES_POR_PAGINA = 4
const textoDelAnimal = (animal) => `${animal.nombre} ${animal.especie} ${animal.estado}`

// Sección "Mis animales" del refugio: los busca y los muestra de a una página.
// "animales" son solo los de este refugio y "apadrinamientos" los activos de esos animales.
const SeccionAnimales = ({ animales, apadrinamientos, onQuitar, onEditar, onPublicarNovedad, onRegistrarUbicacion }) => {
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(animales, textoDelAnimal, ANIMALES_POR_PAGINA)

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
        <p className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center font-body-md text-body-md text-on-surface-variant">
          Todavía no publicaste ningún animal.
        </p>
      )}
      {animales.length > 0 && encontrados.length === 0 && (
        <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-lg">Ningún animal coincide con esa búsqueda.</p>
      )}
      {items.map((animal) => (
        <TarjetaMiAnimal
          key={animal.id}
          animal={animal}
          apadrinamientos={apadrinamientos.filter((a) => a.animal.id === animal.id)}
          onQuitar={onQuitar}
          onEditar={onEditar}
          onPublicarNovedad={onPublicarNovedad}
          onRegistrarUbicacion={onRegistrarUbicacion}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionAnimales
