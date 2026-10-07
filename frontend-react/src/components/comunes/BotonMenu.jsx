// Un botón del menú. Si es la página actual, se ve resaltado.
const BotonMenu = ({ texto, activo, onClick }) => {
  const estilo = activo
    ? 'bg-primary text-on-primary shadow-sm'
    : 'text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed-variant'
  return (
    <button onClick={onClick} className={`px-space-md py-space-sm rounded-full font-label-lg text-label-lg transition ${estilo}`}>
      {texto}
    </button>
  )
}

export default BotonMenu
