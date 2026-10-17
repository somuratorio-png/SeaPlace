import Icono from '../comunes/Icono'
import Precio from '../comunes/Precio'
import { recaudacionMensual } from '../../utils/precios'

// Cuánto recauda un animal del refugio, y los botones para pausar su publicación o abrir su gestión.
// "apadrinamientos" son solo los activos de este animal.
const ResumenMiAnimal = ({ animal, apadrinamientos, abierto, onEditar, onAlternarGestion }) => {
  const pausada = animal.publicacion === 'PAUSADA'

  return (
    <div className="px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        <b className="text-primary">{apadrinamientos.length}</b> {apadrinamientos.length === 1 ? 'padrino' : 'padrinos'} · recauda{' '}
        <b className="text-primary">
          <Precio valor={recaudacionMensual(apadrinamientos)} />
        </b>{' '}
        por mes · {animal.fotos.length} {animal.fotos.length === 1 ? 'foto' : 'fotos'}
      </p>
      <div className="flex flex-wrap items-center gap-space-md">
        {/* Una publicación pausada no se ve en el catálogo, pero conserva sus padrinos y sus datos */}
        <button
          onClick={() => onEditar(animal.id, { publicacion: pausada ? 'ACTIVA' : 'PAUSADA' })}
          className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline"
        >
          <Icono nombre={pausada ? 'play_circle' : 'pause_circle'} clase="text-[18px]" />
          {pausada ? 'Volver a publicar' : 'Pausar'}
        </button>
        <button onClick={onAlternarGestion} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
          <Icono nombre={abierto ? 'expand_less' : 'tune'} clase="text-[18px]" />
          {abierto ? 'Cerrar' : 'Gestionar'}
        </button>
      </div>
    </div>
  )
}

export default ResumenMiAnimal