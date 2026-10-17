// Un dato del certificado: la etiqueta chica arriba y el valor debajo
const DatoCertificado = ({ titulo, valor }) => {
  return (
    <div>
      <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">{titulo}</p>
      <p className="font-title-lg text-title-lg text-primary">{valor}</p>
    </div>
  )
}

export default DatoCertificado