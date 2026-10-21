import { useState } from 'react'
import { precioFinal, tieneDescuento } from '../../utils/precios'
import BarraProgreso from './BarraProgreso'
import Icono from './Icono'
import Modal from './Modal'
import Precio from './Precio'
import { useNavigate } from 'react-router-dom'


const FilaAnimal = ({ animal, onQuitar }) => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <div className="revelar bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex flex-wrap items-center gap-space-md transition hover:shadow-md">
        <img src={animal.imagen} alt={`Foto de ${animal.nombre}`} className="w-20 h-20 object-cover rounded-xl" />

        <div className="flex-1 min-w-40 space-y-1">
          <h3 className="font-title-lg text-title-lg text-primary">
            {animal.nombre}
            {animal.publicacion === 'PAUSADA' && (
              <span className="ml-space-sm align-middle bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full px-space-sm py-0.5 font-label-md text-label-md">Pausada</span>
            )}
            {animal.cambioPendiente && (
              <span className="ml-space-sm align-middle bg-primary-fixed text-on-primary-fixed-variant rounded-full px-space-sm py-0.5 font-label-md text-label-md">Cambios en revisión</span>
            )}
            {animal.publicacion === 'PENDIENTE' && (
              <span className="ml-space-sm align-middle bg-secondary-container text-on-secondary-container rounded-full px-space-sm py-0.5 font-label-md text-label-md">Esperando aprobación</span>
            )}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {animal.especie} · {animal.estado} · <Precio valor={precioFinal(animal)} />/mes
            {tieneDescuento(animal) && ` (en oferta, -${animal.descuento.porcentaje}%)`} · cupos: {animal.cuposDisponibles} libres de {animal.cuposTotales}
          </p>
          <BarraProgreso porcentaje={animal.progreso} />
          <p className="font-label-md text-label-md text-secondary">{animal.progreso}% de la meta mensual cubierta</p>
        </div>

        <div className="flex flex-wrap items-center gap-space-md">
          <button
            onClick={() => navigate(`/animal/${animal.id}`)}
            className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed-variant font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
          >
            <Icono nombre="visibility" clase="text-[18px]" /> Ver ficha
          </button>
          {onQuitar && (
            <button
              onClick={() => setIsVisible(true)}
              className="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
            >
              <Icono nombre="delete" clase="text-[18px]" /> Quitar
            </button>
          )}
        </div>
      </div>

      {isVisible && (
        <Modal
          titulo={`¿Quitar a ${animal.nombre} del catálogo?`}
          mensaje="Su publicación se elimina y deja de verse en el catálogo. Esta acción no se puede deshacer."
          textoConfirmar="Quitar"
          peligro={true}
          onConfirmar={() => {
            onQuitar(animal.id)
            setIsVisible(false)
          }}
          onCancelar={() => setIsVisible(false)}
        />
      )}
    </>
  )
}

export default FilaAnimal
