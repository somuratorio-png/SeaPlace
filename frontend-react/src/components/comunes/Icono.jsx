const Icono = ({ nombre, clase = '' }) => {
  return <span className={`material-symbols-outlined ${clase}`}>{nombre}</span>
}

export default Icono
