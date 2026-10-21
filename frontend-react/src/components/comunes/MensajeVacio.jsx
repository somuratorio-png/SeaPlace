const MensajeVacio = ({ clase = '', children }) => {
  return <p className={`text-center font-body-md text-body-md text-on-surface-variant ${clase}`}>{children}</p>
}

export default MensajeVacio