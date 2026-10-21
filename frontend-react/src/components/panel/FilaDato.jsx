const FilaDato = ({ etiqueta, valor }) => {
  return (
    <div className="flex justify-between gap-space-md">
      <span className="font-body-sm text-body-sm text-on-surface-variant">{etiqueta}</span>
      <span className="font-label-lg text-label-lg text-on-surface text-right">{valor}</span>
    </div>
  )
}

export default FilaDato