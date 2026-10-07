// Barra horizontal que se llena según el porcentaje recibido (0 a 100)
const BarraProgreso = ({ porcentaje }) => {
  return (
    <div className="w-full h-2.5 bg-primary-fixed rounded-full overflow-hidden">
      <div className="llenar h-full bg-linear-to-r from-secondary to-primary-container rounded-full" style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

export default BarraProgreso
