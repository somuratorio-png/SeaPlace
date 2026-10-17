// Selector para sumar fotos a la galería de un animal. Las fotos nuevas se suben al elegirlas
// (los archivos tal cual) y el backend las agrega al final de su galería.
const SumarFotos = ({ animal, onEditar }) => {
  const sumarFotos = (evento) => {
    onEditar(animal.id, { fotos: [...evento.target.files] })
  }

  return (
    <label htmlFor={`fotos-${animal.id}`} className="space-y-space-sm block">
      <h4 className="font-label-lg text-label-lg text-on-surface">Sumar fotos a su galería</h4>
      <input
        type="file"
        id={`fotos-${animal.id}`}
        name="fotos"
        accept="image/*"
        multiple
        onChange={sumarFotos}
        className="w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm"
      />
    </label>
  )
}

export default SumarFotos