import { useState } from 'react'

const PRECIO_BOTIQUIN = 5

// Suma los precios, permite agregar el botiquín opcional y confirmar
const ResumenCarrito = ({ carrito, onConfirmar }) => {
  const [conBotiquin, setConBotiquin] = useState(false)

  // El total se calcula cada vez que se dibuja: no hace falta guardarlo en el estado
  const subtotal = carrito.reduce((suma, item) => suma + item.plan.precio, 0)
  const total = conBotiquin ? subtotal + PRECIO_BOTIQUIN : subtotal

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Resumen</h2>

      <div className="flex justify-between font-body-md text-body-md">
        <span>Apadrinamientos ({carrito.length})</span>
        <span>${subtotal}</span>
      </div>

      <label className="flex items-center gap-space-sm font-body-md text-body-md cursor-pointer">
        <input type="checkbox" checked={conBotiquin} onChange={() => setConBotiquin(!conBotiquin)} className="accent-secondary w-4 h-4" />
        Sumar botiquín de rescate (+${PRECIO_BOTIQUIN})
      </label>

      <div className="flex justify-between items-baseline pt-space-sm border-t border-outline-variant">
        <span className="font-title-lg text-title-lg">Total mensual</span>
        <span className="font-headline-lg text-headline-lg text-primary">${total}</span>
      </div>

      <button onClick={onConfirmar} className="w-full bg-primary text-on-primary font-title-lg text-title-lg py-space-md rounded-lg hover:bg-surface-tint">
        Confirmar apadrinamiento
      </button>
    </div>
  )
}

export default ResumenCarrito
