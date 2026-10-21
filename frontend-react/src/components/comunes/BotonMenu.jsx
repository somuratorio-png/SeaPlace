import { Link } from 'react-router-dom'

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
