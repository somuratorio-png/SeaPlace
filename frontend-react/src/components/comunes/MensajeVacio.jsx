// Mensaje centrado para una lista sin elementos o una búsqueda sin resultados.
// "clase" agrega el fondo y el espaciado que le toque a cada pantalla.
const MensajeVacio = ({ clase = '', children }) => {
  return <p className={`text-center font-body-md text-body-md text-on-surface-variant ${clase}`}>{children}</p>
}

export default MensajeVacio