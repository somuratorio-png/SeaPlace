import { useState } from 'react'
import { claseCampo } from '../../utils/clasesCampo'
import FilaAnimal from '../comunes/FilaAnimal'
import Icono from '../comunes/Icono'
import Modal from '../comunes/Modal'

// Algo de un refugio que espera la revisión del administrador (una publicación nueva o un pedido de cambios),
// con los botones para aprobarlo o rechazarlo. "children" es opcional: lo que haga falta mostrar para decidir
// (por ejemplo, qué campos cambian). Al rechazar se confirma en un cartel donde se puede escribir el motivo:
// onRechazar lo recibe (vacío si no escribió nada).
const RevisionPublicacion = ({
  animal,
  onAprobar,
  onRechazar,
  textoAprobar = 'Aprobar y publicar',
  tituloRechazo = `¿Rechazar la publicación de ${animal.nombre}?`,
  mensajeRechazo = 'No se va a publicar y el refugio recibe una notificación. Si querés, contale por qué así puede corregirla.',
  children,
}) => {
  const [rechazando, setRechazando] = useState(false) // true mientras está abierto el cartel de rechazo
  const [motivo, setMotivo] = useState('')

  const cerrar = () => {
    setRechazando(false)
    setMotivo('')
  }

  return (
    <div className="bg-surface-container-low rounded-2xl">
      <FilaAnimal animal={animal} />
      {children}
      <div className="px-space-md py-space-sm flex flex-wrap justify-end gap-space-sm">
        <button
          onClick={() => setRechazando(true)}
          className="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
        >
          <Icono nombre="close" clase="text-[18px]" /> Rechazar
        </button>
        <button onClick={onAprobar} className="inline-flex items-center gap-1 bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full">
          <Icono nombre="check" clase="text-[18px]" /> {textoAprobar}
        </button>
      </div>

      {rechazando && (
        <Modal
          titulo={tituloRechazo}
          mensaje={mensajeRechazo}
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
