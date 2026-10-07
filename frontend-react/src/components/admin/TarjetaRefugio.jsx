import { useState } from 'react'
import Icono from '../comunes/Icono'
import FilaAnimal from '../refugio/FilaAnimal'
import Chip from './Chip'

// Un refugio en la lista del administrador. Al tocar "Ver animales" se despliegan los suyos.
const TarjetaRefugio = ({ refugio, animales, onCambiarActivo, onVerAnimal, onQuitarAnimal }) => {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className={`bg-surface-container-lowest rounded-2xl shadow-sm border-l-4 transition hover:shadow-md ${refugio.activo ? 'border-secondary' : 'border-error'}`}>
      <div className="p-space-md flex flex-wrap items-center gap-space-md">
        <div className="w-12 h-12 rounded-full fondo-mar text-on-primary flex items-center justify-center">
          <Icono nombre="home_health" />
        </div>

        <div className="flex-1 min-w-40 space-y-1">
          <h3 className="font-title-lg text-title-lg text-on-surface">
            {refugio.nombre} {refugio.apellido}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{refugio.mail}</p>
          <div className="flex flex-wrap gap-space-xs">
            <Chip texto={refugio.activo ? 'Activo' : 'Dado de baja'} tono={refugio.activo ? 'verde' : 'rojo'} />
            <Chip texto={`${animales.length} ${animales.length === 1 ? 'animal' : 'animales'}`} tono="azul" />
          </div>
        </div>

        {/* Fotos chiquitas de sus animales, una encima de la otra */}
        <div className="flex -space-x-3">
          {animales.map((animal) => (
            <img
              key={animal.id}
              src={animal.imagen}
              alt={`Foto de ${animal.nombre}`}
              title={animal.nombre}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-container-lowest"
            />
          ))}
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => setAbierto(!abierto)}
            className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-fixed-variant font-label-lg text-label-lg px-space-md py-space-sm rounded-full"
          >
            <Icono nombre={abierto ? 'expand_less' : 'expand_more'} clase="text-[18px]" />
            {abierto ? 'Ocultar animales' : 'Ver animales'}
          </button>
          <button
            onClick={() => onCambiarActivo(refugio.nombreUsuario)}
            className={`font-label-lg text-label-lg px-space-md py-space-sm rounded-full ${
              refugio.activo ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'
            }`}
          >
            {refugio.activo ? 'Dar de baja' : 'Reactivar'}
          </button>
        </div>
      </div>

      {abierto && (
        <div className="bg-surface-container-low rounded-b-2xl p-space-md space-y-space-sm">
          {animales.length === 0 && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">Este refugio todavía no cargó animales.</p>
          )}
          {animales.map((animal) => (
            <FilaAnimal key={animal.id} animal={animal} onVer={onVerAnimal} onQuitar={onQuitarAnimal} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TarjetaRefugio
