import { useState } from 'react'

// Foto grande + miniaturas. Al tocar una miniatura, pasa a ser la foto grande.
const Galeria = ({ fotos, nombre }) => {
  const [fotoActiva, setFotoActiva] = useState(0)

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm">
      <img src={fotos[fotoActiva]} alt={`Foto de ${nombre}`} className="w-full aspect-[4/3] object-cover rounded-lg" />

      {fotos.length > 1 && (
        <div className="grid grid-cols-5 gap-space-sm">
          {fotos.map((foto, indice) => (
            <button
              key={foto}
              onClick={() => setFotoActiva(indice)}
              className={`rounded-lg overflow-hidden ${indice === fotoActiva ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={foto} alt={`Miniatura ${indice + 1} de ${nombre}`} className="w-full aspect-[4/3] object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Galeria
