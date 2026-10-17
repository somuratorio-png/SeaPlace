// Las miniaturas de las fotos elegidas. "fotos" es una lista de { archivo, vistaPrevia }.
const VistaPreviaFotos = ({ fotos }) => {
  return (
    <div className="flex flex-wrap gap-space-sm">
      {fotos.map((foto, indice) => (
        <img key={foto.vistaPrevia} src={foto.vistaPrevia} alt={`Foto elegida ${indice + 1}`} className="w-20 h-20 object-cover rounded-xl" />
      ))}
    </div>
  )
}

export default VistaPreviaFotos