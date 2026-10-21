import { claseCampo } from '../../utils/clasesCampo'

const CampoTexto = ({ etiqueta, nombre, tipo = 'text', valor, onCambiar, maximo, teclado, ejemplo }) => {
  return (
    <label htmlFor={nombre} className="flex flex-col gap-1.5">
      <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
      <input
        type={tipo}
        id={nombre}
        name={nombre}
        value={valor}
        onChange={onCambiar}
        maxLength={maximo}
        inputMode={teclado}
        placeholder={ejemplo}
        required
        className={claseCampo}
      />
    </label>
  )
}

export default CampoTexto
