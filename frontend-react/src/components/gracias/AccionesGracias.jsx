// Los dos botones del final de la página de gracias: ir al panel o seguir viendo animales
const AccionesGracias = ({ onPanel, onCatalogo }) => {
  return (
    <div className="flex flex-wrap justify-center gap-space-md">
      <button onClick={onPanel} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
        Ir a mi panel
      </button>
      <button onClick={onCatalogo} className="bg-primary-fixed text-on-primary-fixed-variant font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
        Seguir viendo animales
      </button>
    </div>
  )
}

export default AccionesGracias