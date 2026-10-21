const SinApadrinados = ({ onElegir }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center space-y-space-md">
      <p className="font-body-md text-body-md text-on-surface-variant">Todavía no apadrinaste a ningún animal.</p>
      <button onClick={onElegir} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
        Elegir un animal
      </button>
    </div>
  )
}

export default SinApadrinados