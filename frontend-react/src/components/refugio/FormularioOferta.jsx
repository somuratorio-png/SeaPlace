import { useState } from 'react'
import { formatearFecha, hoy } from '../../utils/fechas'
import { tieneDescuento } from '../../utils/precios'

const claseCampo = 'w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40'

// Pone o quita la oferta de un animal: un porcentaje de descuento hasta una fecha
const FormularioOferta = ({ animal, onEditar }) => {
  const [porcentaje, setPorcentaje] = useState('20')
  const [hasta, setHasta] = useState('')

  const guardar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    onEditar(animal.id, { descuento: { porcentaje: Number(porcentaje), hasta } })
  }

  if (tieneDescuento(animal)) {
    return (
      <div className="space-y-space-sm">
        <h4 className="font-label-lg text-label-lg text-on-surface">Oferta</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tiene {animal.descuento.porcentaje}% de descuento hasta el {formatearFecha(animal.descuento.hasta)}.
        </p>
        <button onClick={() => onEditar(animal.id, { descuento: null })} className="font-label-lg text-label-lg text-error hover:underline">
          Quitar oferta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={guardar} className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Poner en oferta</h4>
      <div className="grid grid-cols-2 gap-space-sm">
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Descuento (%)</span>
          <input type="number" min="1" max="90" required value={porcentaje} onChange={(evento) => setPorcentaje(evento.target.value)} className={claseCampo} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Hasta</span>
          <input type="date" min={hoy()} required value={hasta} onChange={(evento) => setHasta(evento.target.value)} className={claseCampo} />
        </label>
      </div>
      <button type="submit" className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-tertiary-container">
        Aplicar oferta
      </button>
    </form>
  )
}

export default FormularioOferta
