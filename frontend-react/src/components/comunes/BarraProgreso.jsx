// Barra horizontal que se llena según el porcentaje recibido (0 a 100)
const BarraProgreso = ({ porcentaje }) => {
  return (
    <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
      <div className="h-full bg-secondary rounded-full" style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

export default BarraProgreso
