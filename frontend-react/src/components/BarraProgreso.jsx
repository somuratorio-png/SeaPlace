// Barra de progreso reutilizable (se repetía en inicio, catálogo, detalle y carrito).
export default function BarraProgreso({ valor, alto = 'h-2', fondo = 'bg-surface-container-high' }) {
  return (
    <div
      className={`w-full ${alto} ${fondo} rounded-full overflow-hidden`}
      role="progressbar"
      aria-valuenow={valor}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${valor}%` }} />
    </div>
  )
}
