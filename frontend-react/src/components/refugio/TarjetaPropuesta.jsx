import { useState } from 'react'
import { useDispatch } from 'react-redux'
import BarraProgreso from '../comunes/BarraProgreso'
import LogoPatrocinador from '../comunes/LogoPatrocinador'
import Precio from '../comunes/Precio'
import { aceptarCampania, rechazarCampania } from '../../Redux/campaniasSlice'
import { formatearFecha } from '../../utils/fechas'
import { claseCampo } from '../../utils/clasesCampo'

// Cómo se ve el estado de una campaña desde el refugio
const estadoDe = (campania) => {
  if (campania.pendiente) {
    return { texto: 'Espera tu respuesta', clase: 'bg-tertiary text-on-tertiary' }
  }
  if (campania.estado === 'RECHAZADA') {
    return { texto: 'Rechazada', clase: 'bg-error-container text-on-error-container' }
  }
  if (campania.vigente) {
    return { texto: 'Duplicando', clase: 'bg-secondary text-on-secondary' }
  }
  if (!campania.activa) {
    return { texto: 'Terminada', clase: 'bg-surface-container-high text-on-surface-variant' }
  }
  return { texto: 'Aceptada', clase: 'bg-surface-container-high text-on-surface-variant' }
}

// Una campaña propuesta para un animal del refugio: quién la propone, para qué animal, el tope y hasta cuándo.
// Si espera respuesta se puede aceptar o rechazar (con un motivo opcional, que le llega a la empresa).
// Si falla, el mensaje lo muestra arriba PanelRefugio (errorAccion de campanias).
const TarjetaPropuesta = ({ campania }) => {
  const dispatch = useDispatch()
  const [rechazando, setRechazando] = useState(false) // true mientras se escribe el motivo
  const [motivo, setMotivo] = useState('')
  const estado = estadoDe(campania)

  const rechazar = () => {
    dispatch(rechazarCampania({ idCampania: campania.id, motivo: motivo.trim() }))
    setRechazando(false)
  }

  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-sm">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <LogoPatrocinador nombre={campania.empresa.nombre} icono={campania.empresa.icono} />
        <span className={`px-2.5 py-1 rounded-full font-label-md text-label-md ${estado.clase}`}>{estado.texto}</span>
      </div>
      {campania.empresa.descripcion && <p className="font-body-sm text-body-sm text-on-surface-variant">{campania.empresa.descripcion}</p>}

      <p className="font-body-md text-body-md text-on-surface">
        Duplicar los aportes para <b>{campania.animal}</b> hasta <b><Precio valor={campania.tope} /></b>, hasta el {formatearFecha(campania.hasta)}.
      </p>

      {!campania.pendiente && campania.estado === 'ACEPTADA' && (
        <>
          <BarraProgreso porcentaje={campania.porcentaje} />
          <p className="font-label-md text-label-md text-on-surface">
            Ya sumó <Precio valor={campania.aportado} /> para {campania.animal}
          </p>
        </>
      )}
      {campania.estado === 'RECHAZADA' && campania.motivoRechazo && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">Tu motivo: {campania.motivoRechazo}</p>
      )}

      {campania.pendiente && !rechazando && (
        <div className="flex flex-wrap gap-space-sm pt-space-xs">
          <button onClick={() => dispatch(aceptarCampania(campania.id))} className="bg-secondary text-on-secondary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-on-secondary-container">
            Aceptar
          </button>
          <button onClick={() => setRechazando(true)} className="text-error font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-error-container">
            Rechazar
          </button>
        </div>
      )}

      {campania.pendiente && rechazando && (
        <div className="space-y-space-sm pt-space-xs">
          <label htmlFor={`motivo-${campania.id}`} className="flex flex-col gap-1.5">
            <span className="font-label-lg text-label-lg text-on-surface">¿Por qué la rechazás? (opcional, se lo contamos a la empresa)</span>
            <textarea id={`motivo-${campania.id}`} name="motivo" rows="2" maxLength={300} value={motivo} onChange={(evento) => setMotivo(evento.target.value)} className={claseCampo} />
          </label>
          <div className="flex flex-wrap gap-space-sm">
            <button onClick={rechazar} className="bg-error text-on-error font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
              Rechazar campaña
            </button>
            <button onClick={() => setRechazando(false)} className="text-on-surface-variant font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-surface-container-low">
              Volver
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default TarjetaPropuesta
