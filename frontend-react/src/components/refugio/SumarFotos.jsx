import CampoArchivo from '../comunes/CampoArchivo'

// Selector para sumar fotos a la galería de un animal. Las fotos nuevas se suben al elegirlas
// (los archivos tal cual) y el backend las agrega al final de su galería.
const SumarFotos = ({ animal, onEditar }) => {
  const sumarFotos = (evento) => {
    onEditar(animal.id, { fotos: [...evento.target.files] })
    evento.target.value = '' // así se puede volver a elegir la misma foto
  }

  return (
    <div className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Sumar fotos a su galería</h4>
      <CampoArchivo etiqueta="Sumar fotos" nombre={`fotos-${animal.id}`} aceptar="image/*" multiple onCambiar={sumarFotos} />
    </div>
  )
}

export default SumarFotos
