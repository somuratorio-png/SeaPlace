import { useState } from 'react'
import { leerFotos } from '../../utils/imagenes'
import { recaudacionMensual } from '../../utils/precios'
import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'
import FilaAnimal from './FilaAnimal'
import FormularioNovedad from './FormularioNovedad'
import FormularioOferta from './FormularioOferta'

// Un animal del refugio con todo lo que se puede hacer con él: ver cuánto recauda,
// ponerlo en oferta, publicar novedades y sumarle fotos.
// "apadrinamientos" son solo los activos de este animal.
const TarjetaMiAnimal = ({ animal, apadrinamientos, onVer, onQuitar, onEditar, onPublicarNovedad }) => {
  const [abierto, setAbierto] = useState(false)

  // Las fotos nuevas se agregan al final de las que ya tenía
  const sumarFotos = async (evento) => {
    const nuevas = await leerFotos(evento.target.files)
    onEditar(animal.id, { fotos: [...animal.fotos, ...nuevas] })
  }

  return (
    <div className="bg-surface-container-low rounded-2xl">
      <FilaAnimal animal={animal} onVer={onVer} onQuitar={onQuitar} />

      <div className="px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <b className="text-primary">{apadrinamientos.length}</b> {apadrinamientos.length === 1 ? 'padrino' : 'padrinos'} · recauda{' '}
          <b className="text-primary">
            <Precio valor={recaudacionMensual(apadrinamientos)} />
          </b>{' '}
          por mes · {animal.fotos.length} {animal.fotos.length === 1 ? 'foto' : 'fotos'}
        </p>
        <button onClick={() => setAbierto(!abierto)} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
          <Icono nombre={abierto ? 'expand_less' : 'tune'} clase="text-[18px]" />
          {abierto ? 'Cerrar' : 'Gestionar'}
        </button>
      </div>

      {abierto && (
        <div className="px-space-md pb-space-md grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          <FormularioOferta animal={animal} onEditar={onEditar} />
          <FormularioNovedad animal={animal} onPublicar={onPublicarNovedad} />
          <label className="space-y-space-sm block">
            <h4 className="font-label-lg text-label-lg text-on-surface">Sumar fotos a su galería</h4>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={sumarFotos}
              className="w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm"
            />
          </label>
        </div>
      )}
    </div>
  )
}

export default TarjetaMiAnimal
