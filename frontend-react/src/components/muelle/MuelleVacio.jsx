import Portada from '../comunes/Portada'

// Lo que se ve cuando el muelle no tiene ningún animal, con un botón para ir al catálogo
const MuelleVacio = ({ onVerCatalogo }) => {
  return (
    <>
      <Portada icono="anchor" etiqueta="Muelle de apadrinamiento" titulo="Tu muelle está vacío" texto="Todavía no elegiste a quién apadrinar." />
      <div className="text-center py-space-lg px-margin-mobile">
        <button onClick={onVerCatalogo} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
          Ver catálogo
        </button>
      </div>
    </>
  )
}

export default MuelleVacio