import { useState } from 'react'
import { claseCampo } from '../../utils/clasesCampo'
import FilaAnimal from '../comunes/FilaAnimal'
import Icono from '../comunes/Icono'
import Modal from '../comunes/Modal'

// Una publicación que espera la aprobación del administrador, con los botones para aprobarla o rechazarla.
// Al rechazar se confirma en un cartel donde se puede escribir el motivo: onRechazar lo recibe (vacío si no escribió nada).
const RevisionPublicacion = ({ animal, onAprobar, onRechazar }) => {
  const [rechazando, setRechazando] = useState(false) // true mientras está abierto el cartel de rechazo
  const [motivo, setMotivo] = useState('')

  const cerrar = () => {
    setRechazando(false)
    setMotivo('')
  }

  return (
    <div className="bg-surface-container-low rounded-2xl">
      <FilaAnimal animal={animal} />
      <div className="px-space-md py-space-sm flex flex-wrap justify-end gap-space-sm">
        <button
          onClick={() => setRechazando(true)}
          className="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
        >
          <Icono nombre="close" clase="text-[18px]" /> Rechazar
        </button>
        <button onClick={onAprobar} className="inline-flex items-center gap-1 bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full">
          <Icono nombre="check" clase="text-[18px]" /> Aprobar y publicar
        </button>
      </div>

      {rechazando && (
        <Modal
          titulo={`¿Rechazar la publicación de ${animal.nombre}?`}
          mensaje="No se va a publicar y el refugio recibe una notificación. Si querés, contale por qué así puede corregirla."
          textoConfirmar="Rechazar"
          peligro={true}
          onConfirmar={() => {
            onRechazar(motivo.trim())
            cerrar()
          }}
          onCancelar={cerrar}
        >
          <label htmlFor={`motivo-${animal.id}`} className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface">Motivo (opcional)</span>
            <textarea
              id={`motivo-${animal.id}`}
              name="motivo"
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
              rows={3}
              maxLength={500}
              className={claseCampo}
            />
          </label>
        </Modal>
      )}
    </div>
  )
}

export default RevisionPublicacion
