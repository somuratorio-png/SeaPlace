import { claseCampo } from '../../utils/clasesCampo'

const CampoArchivo = ({ etiqueta, nombre, onCambiar, aceptar, multiple = false }) => {
  return (
    <label htmlFor={nombre} className="flex flex-col gap-1.5">
      <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
      <input type="file" id={nombre} name={nombre} accept={aceptar} multiple={multiple} onChange={onCambiar} className={claseCampo} />
    </label>
  )
}

export default CampoArchivo