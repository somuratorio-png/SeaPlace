import { useState } from 'react'
import Icono from '../comunes/Icono'
import Modal from '../comunes/Modal'
import Precio from '../comunes/Precio'
import { recaudacionMensual } from '../../utils/precios'

const ResumenMiAnimal = ({ animal, apadrinamientos, abierto, onEditar, onAlternarGestion }) => {
  const pausada = animal.publicacion === 'PAUSADA'
  const pendiente = animal.publicacion === 'PENDIENTE'
  const [isVisible, setIsVisible] = useState(false)

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
        {pendiente ? (
          <span className="inline-flex items-center gap-1 font-label-lg text-label-lg text-on-surface-variant">
            <Icono nombre="hourglass_top" clase="text-[18px]" /> Se publica cuando SeaPlace la apruebe
          </span>
        ) : (
          <button
            onClick={() => (pausada ? onEditar(animal.id, { publicacion: 'ACTIVA' }) : setIsVisible(true))}
            className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline"
          >
            <Icono nombre={pausada ? 'play_circle' : 'pause_circle'} clase="text-[18px]" />
            {pausada ? 'Volver a publicar' : 'Pausar'}
          </button>
        )}

        {isVisible && (
          <Modal
            titulo={`¿Pausar la publicación de ${animal.nombre}?`}
            mensaje="Deja de verse en el catálogo, pero conserva sus padrinos y sus datos. Podés volver a publicarla cuando quieras."
            textoConfirmar="Pausar"
            onConfirmar={() => {
              onEditar(animal.id, { publicacion: 'PAUSADA' })
              setIsVisible(false)
            }}
            onCancelar={() => setIsVisible(false)}
          />
        )}
        <button onClick={onAlternarGestion} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
          <Icono nombre={abierto ? 'expand_less' : 'tune'} clase="text-[18px]" />
          {abierto ? 'Cerrar' : 'Gestionar'}
        </button>
      </div>
    </div>
  )
}

export default ResumenMiAnimal