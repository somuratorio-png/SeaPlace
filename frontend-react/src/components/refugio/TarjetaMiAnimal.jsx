import { useState } from 'react'
import FilaAnimal from '../comunes/FilaAnimal'
import GestionAnimal from './GestionAnimal'
import ResumenMiAnimal from './ResumenMiAnimal'

// Un animal del refugio con todo lo que se puede hacer con él: ver cuánto recauda, pausar su
// publicación, corregir sus datos, ponerlo en oferta, publicar novedades, informar su ubicación y sumarle fotos.
// "apadrinamientos" son solo los activos de este animal.
const TarjetaMiAnimal = ({ animal, apadrinamientos, categorias, onQuitar, onEditar, onGuardarDatos, onPublicarNovedad, onRegistrarUbicacion }) => {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="bg-surface-container-low rounded-2xl">
      <FilaAnimal animal={animal} onQuitar={onQuitar} />
      <ResumenMiAnimal animal={animal} apadrinamientos={apadrinamientos} abierto={abierto} onEditar={onEditar} onAlternarGestion={() => setAbierto(!abierto)} />

      {abierto && (
        <GestionAnimal
          animal={animal}
          categorias={categorias}
          onEditar={onEditar}
          onGuardarDatos={onGuardarDatos}
          onPublicarNovedad={onPublicarNovedad}
          onRegistrarUbicacion={onRegistrarUbicacion}
        />
      )}
    </div>
  )
}

export default TarjetaMiAnimal