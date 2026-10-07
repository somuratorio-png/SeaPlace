import { useState } from 'react'
import { paginar } from '../../utils/paginar'
import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaMiAnimal from './TarjetaMiAnimal'

const ANIMALES_POR_PAGINA = 4

// Sección "Mis animales" del refugio: los busca y los muestra de a una página.
// "animales" son solo los de este refugio y "apadrinamientos" los activos de esos animales.
const SeccionAnimales = ({ animales, apadrinamientos, onVer, onQuitar, onEditar, onPublicarNovedad }) => {
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  const texto = busqueda.toLowerCase()
  const encontrados = animales.filter((animal) => `${animal.nombre} ${animal.especie} ${animal.estado}`.toLowerCase().includes(texto))
  const { items, paginaActual, totalPaginas } = paginar(encontrados, pagina, ANIMALES_POR_PAGINA)

  // Al buscar se vuelve a la primera página
  const buscar = (valor) => {
    setBusqueda(valor)
    setPagina(0)
  }

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
          onVer={onVer}
          onQuitar={onQuitar}
          onEditar={onEditar}
          onPublicarNovedad={onPublicarNovedad}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionAnimales
