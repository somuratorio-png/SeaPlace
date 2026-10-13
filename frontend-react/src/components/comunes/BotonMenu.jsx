import { Link } from 'react-router-dom'

// Un link del menú. Es un <Link>: cambia de página sin recargarla. Si es la página actual, se ve resaltado.
const BotonMenu = ({ texto, ruta, activo, onClick }) => {
  const estilo = activo
    ? 'bg-primary text-on-primary shadow-sm'
    : 'text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed-variant'
  return (
    <Link to={ruta} onClick={onClick} className={`px-space-md py-space-sm rounded-full font-label-lg text-label-lg transition ${estilo}`}>
      {texto}
    </Link>
  )
}

export default BotonMenu
