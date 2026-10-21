import { useState } from 'react'
import MensajeError from '../comunes/MensajeError'
import Modal from '../comunes/Modal'
import { formatearFecha, hoy } from '../../utils/fechas'
import { tieneDescuento } from '../../utils/precios'

const claseCampo = 'w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40'

const FormularioOferta = ({ animal, onEditar }) => {
  const [porcentaje, setPorcentaje] = useState('20')
  const [hasta, setHasta] = useState('')
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  const guardar = (evento) => {
    evento.preventDefault()
    if (!porcentaje.trim() || !hasta.trim()) {
      setError('Completá todos los campos')
      return
    }
    setError(null)
    onEditar(animal.id, { descuento: { porcentaje: Number(porcentaje), hasta } })
  }

  if (tieneDescuento(animal)) {
    return (
      <div className="space-y-space-sm">
        <h4 className="font-label-lg text-label-lg text-on-surface">Oferta</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tiene {animal.descuento.porcentaje}% de descuento hasta el {formatearFecha(animal.descuento.hasta)}.
        </p>
        <button onClick={() => setIsVisible(true)} className="font-label-lg text-label-lg text-error hover:underline">
          Quitar oferta
        </button>

        {isVisible && (
          <Modal
            titulo="¿Quitar la oferta?"
            mensaje={`El descuento del ${animal.descuento.porcentaje}% se elimina y la cuota vuelve a su valor original.`}
            textoConfirmar="Quitar oferta"
            peligro={true}
            onConfirmar={() => {
              onEditar(animal.id, { descuento: null })
              setIsVisible(false)
            }}
            onCancelar={() => setIsVisible(false)}
          />
        )}
      </div>
    )
  }

  return (
    <form onSubmit={guardar} className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Poner en oferta</h4>
      <div className="grid grid-cols-2 gap-space-sm">
        <label htmlFor={`porcentaje-${animal.id}`} className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Descuento (%)</span>
          <input type="number" id={`porcentaje-${animal.id}`} name="porcentaje" min="1" max="90" required value={porcentaje} onChange={(evento) => setPorcentaje(evento.target.value)} className={claseCampo} />
        </label>
        <label htmlFor={`hasta-${animal.id}`} className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Hasta</span>
          <input type="date" id={`hasta-${animal.id}`} name="hasta" min={hoy()} required value={hasta} onChange={(evento) => setHasta(evento.target.value)} className={claseCampo} />
        </label>
      </div>
      {error && <MensajeError mensaje={error} />}
      <button type="submit" className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-tertiary-container">
        Aplicar oferta
      </button>
    </form>
  )
}

export default FormularioOferta
