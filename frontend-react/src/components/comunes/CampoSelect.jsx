import { claseCampo } from '../../utils/clasesCampo'

const CampoSelect = ({ etiqueta, nombre, valor, onCambiar, opciones }) => {
  return (
    <label htmlFor={nombre} className="flex flex-col gap-1.5">
      <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
      <select id={nombre} name={nombre} value={valor} onChange={onCambiar} className={claseCampo}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CampoSelect