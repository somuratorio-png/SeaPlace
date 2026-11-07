import { useState } from 'react'
import { useDispatch } from 'react-redux'
import BarraProgreso from '../comunes/BarraProgreso'
import MensajeVacio from '../comunes/MensajeVacio'
import Modal from '../comunes/Modal'
import Precio from '../comunes/Precio'
import { finalizarCampania } from '../../Redux/patrocinioSlice'
import { formatearFecha } from '../../utils/fechas'

// Cómo se ve el estado de una campaña
const estadoDe = (campania) => {
  if (campania.vigente) {
    return { texto: 'Duplicando', clase: 'bg-secondary text-on-secondary' }
  }
  if (!campania.activa) {
    return { texto: 'Terminada', clase: 'bg-surface-container-high text-on-surface-variant' }
  }
  if (campania.restante <= 0) {
    return { texto: 'Tope alcanzado', clase: 'bg-tertiary text-on-tertiary' }
  }
  return { texto: 'Fuera de fecha', clase: 'bg-surface-container-high text-on-surface-variant' }
}

// Las campañas del patrocinador, cada una con cuánto del tope ya se usó.
// Las que siguen activas se pueden terminar (con una confirmación); lo ya duplicado sigue contando.
const ListaCampanias = ({ campanias }) => {
  const dispatch = useDispatch()
  const [aTerminar, setATerminar] = useState(null) // la campaña que se está por terminar, o null

  if (campanias.length === 0) {
    return <MensajeVacio clase="bg-surface-container-lowest rounded-2xl p-space-lg">Todavía no armaste ninguna campaña. ¡Elegí un animal y empezá a duplicar!</MensajeVacio>
  }

  return (
    <div className="space-y-space-md">
      {campanias.map((campania) => {
        const estado = estadoDe(campania)
        return (
          <article key={campania.id} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <h3 className="font-title-lg text-title-lg text-primary">{campania.animal}</h3>
              <span className={`px-2.5 py-1 rounded-full font-label-md text-label-md ${estado.clase}`}>{estado.texto}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Del {formatearFecha(campania.desde)} al {formatearFecha(campania.hasta)}
            </p>
            <BarraProgreso porcentaje={campania.porcentaje} />
            <div className="flex flex-wrap justify-between gap-space-sm font-label-md text-label-md">
              <span className="text-on-surface">
                Duplicaste <Precio valor={campania.aportado} /> de <Precio valor={campania.tope} />
              </span>
              {campania.activa && (
                <button onClick={() => setATerminar(campania)} className="text-error hover:underline print:hidden">
                  Terminar campaña
                </button>
              )}
            </div>
          </article>
        )
      })}

      {aTerminar !== null && (
        <Modal
          titulo={`¿Terminar la campaña de ${aTerminar.animal}?`}
          mensaje="Desde ahora los aportes para este animal no se duplican más. Lo que ya duplicaste sigue contando en tu impacto."
          textoConfirmar="Sí, terminar"
          textoCancelar="No, seguir"
          peligro={true}
          onConfirmar={() => {
            dispatch(finalizarCampania(aTerminar.id))
            setATerminar(null)
          }}
          onCancelar={() => setATerminar(null)}
        />
      )}
    </div>
  )
}

export default ListaCampanias
