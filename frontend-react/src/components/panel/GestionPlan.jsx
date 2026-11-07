import { useState } from 'react'
import Modal from '../comunes/Modal'

// Permite cancelar el apadrinamiento. El plan no se puede cambiar: se elige al apadrinar.
// Cancelar pide una segunda confirmación (un modal) para que no pase por un clic de más.
const GestionPlan = ({ item, onCancelar }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Gestionar apadrinamiento</h2>

      <button onClick={() => setIsVisible(true)} className="font-label-lg text-label-lg text-error hover:underline">
        Cancelar apadrinamiento
      </button>

      {isVisible && (
        <Modal
          titulo="¿Cancelar el apadrinamiento?"
          mensaje={`${item.animal.nombre} va a dejar de recibir tu aporte mensual. Sus cupos vuelven a estar disponibles y el apadrinamiento queda en tu historial.`}
          textoConfirmar="Sí, cancelar"
          textoCancelar="No, seguir apadrinando"
          peligro={true}
          onConfirmar={() => {
            onCancelar(item.id)
            setIsVisible(false)
          }}
          onCancelar={() => setIsVisible(false)}
        />
      )}
    </div>
  )
}

export default GestionPlan
