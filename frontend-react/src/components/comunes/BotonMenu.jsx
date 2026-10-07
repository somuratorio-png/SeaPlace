// Un botón del menú. Si es la página actual, se ve resaltado.
const BotonMenu = ({ texto, activo, onClick }) => {
  const estilo = activo
    ? 'bg-primary-container text-on-primary'
    : 'text-on-surface-variant hover:bg-surface-container-high'
  return (
    <button onClick={onClick} className={`px-space-md py-space-sm rounded-lg font-label-lg text-label-lg ${estilo}`}>
      {texto}
    </button>
  )
}

export default BotonMenu
