import Icono from './Icono'

// Botón "+" para elegir archivos: el input real queda oculto y se abre al tocar el botón.
// "etiqueta" es lo que lee el lector de pantalla. "aceptar" limita los tipos (por ejemplo "image/*").
// Un input de archivos no se puede "controlar": para vaciarlo, quien lo usa le cambia la key.
const CampoArchivo = ({ etiqueta, nombre, onCambiar, aceptar, multiple = false }) => {
  return (
    <label
      htmlFor={nombre}
      title={etiqueta}
      className="w-20 h-20 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant flex items-center justify-center cursor-pointer hover:border-secondary hover:text-secondary focus-within:ring-2 focus-within:ring-secondary/40"
    >
      <Icono nombre="add" clase="text-[32px]" />
      <span className="sr-only">{etiqueta}</span>
      <input type="file" id={nombre} name={nombre} accept={aceptar} multiple={multiple} onChange={onCambiar} className="sr-only" />
    </label>
  )
}

export default CampoArchivo
