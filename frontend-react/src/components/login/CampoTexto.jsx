// Campo de formulario con su etiqueta. Es "controlado": el valor lo maneja el formulario padre.
const CampoTexto = ({ etiqueta, nombre, tipo = 'text', valor, onCambiar }) => {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
      <input
        type={tipo}
        name={nombre}
        value={valor}
        onChange={onCambiar}
        required
        className="w-full bg-surface-container-low rounded-lg px-space-md py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40"
      />
    </label>
  )
}

export default CampoTexto
