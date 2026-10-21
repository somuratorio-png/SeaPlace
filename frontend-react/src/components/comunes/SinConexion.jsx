import AvisoError from './AvisoError'

const SinConexion = ({ mensaje, onReintentar }) => {
  return (
    <div className="max-w-2xl mx-auto px-margin-mobile py-space-xl space-y-space-md text-center">
      <AvisoError mensaje={mensaje} />
      <button onClick={onReintentar} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
        Volver a intentar
      </button>
    </div>
  )
}

export default SinConexion
