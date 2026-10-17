import { useState } from 'react'
import Icono from '../comunes/Icono'
import AccionesRefugio from './AccionesRefugio'
import AnimalesDelRefugio from './AnimalesDelRefugio'
import Chip from './Chip'
import PilaFotosAnimales from './PilaFotosAnimales'

// Un refugio en la lista del administrador. Al tocar "Ver animales" se despliegan los suyos.
// Si el refugio todavía no fue aprobado, aparece el botón para aprobarlo.
const TarjetaRefugio = ({ refugio, animales, onCambiarActivo, onAprobar, onQuitarAnimal }) => {
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
            {!refugio.aprobado && <Chip texto="Pendiente de aprobación" tono="coral" />}
            <Chip texto={`${animales.length} ${animales.length === 1 ? 'animal' : 'animales'}`} tono="azul" />
          </div>
        </div>

        <PilaFotosAnimales animales={animales} />
        <AccionesRefugio refugio={refugio} abierto={abierto} onAprobar={onAprobar} onAlternarAnimales={() => setAbierto(!abierto)} onCambiarActivo={onCambiarActivo} />
      </div>

      {abierto && <AnimalesDelRefugio animales={animales} onQuitar={onQuitarAnimal} />}
    </div>
  )
}

export default TarjetaRefugio