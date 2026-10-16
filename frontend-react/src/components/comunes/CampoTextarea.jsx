import { claseCampo } from '../../utils/clasesCampo'

// Texto largo con su etiqueta. "filas" es el alto inicial. Es "controlado", como CampoTexto.
const CampoTextarea = ({ etiqueta, nombre, valor, onCambiar, filas = 3 }) => {
  return (
    <label htmlFor={nombre} className="flex flex-col gap-1.5">
      <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
      <textarea id={nombre} name={nombre} value={valor} onChange={onCambiar} required rows={filas} className={claseCampo} />
    </label>
  )
}

export default CampoTextarea